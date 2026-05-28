export async function getTasks(db) {
    if (!db) return

    const result = await db.query(`
        SELECT 
            t.name,
            t.description,
            t.start_time,
            t.end_time,
            t.completed_time,
            t.priority,
            COALESCE(
                json_agg(DISTINCT jsonb_build_object('name', tags.name, 'color', tags.color)) 
                FILTER (WHERE tags.name IS NOT NULL), 
                '[]'::json
            ) as tags,
            COALESCE(
                json_agg(DISTINCT jsonb_build_object('id', st.id, 'name', st.name, 'is_completed', st.is_completed)) 
                FILTER (WHERE st.id IS NOT NULL), 
                '[]'::json
            ) as sub_tasks
        FROM tasks t
        LEFT JOIN task_tags tt ON t.name = tt.task_name
        LEFT JOIN tags ON tt.tag_name = tags.name
        LEFT JOIN task_sub_tasks tst ON t.name = tst.task_name
        LEFT JOIN sub_tasks st ON tst.sub_task_id = st.id
        GROUP BY t.name
        ORDER BY t.name
    `)
    return result.rows
}

// Einzelne Funktion für Insert UND Update (Upsert)
export async function insertTask(db, task) {
    const errors = {}
    if (!task.name)        errors.name        = "Bitte einen Namen eingeben"
    if (!task.description) errors.description = "Bitte eine Beschreibung eingeben"
    if (Object.keys(errors).length > 0) return { errors }

    const priority      = task.priority      || '1'
    const completed     = task.completed_time || null
    const start         = (task.start_time && task.end_time) ? task.start_time : null
    const end           = (task.start_time && task.end_time) ? task.end_time   : null
    const sub_tasks     = task.sub_tasks || []
    const tags          = task.tags      || []

    try {
        // ── 1. Task upsert ───────────────────────────────────────────────
        await db.query(`
            INSERT INTO tasks (name, description, start_time, end_time, completed_time, priority)
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (name) DO UPDATE
                SET description    = EXCLUDED.description,
                    start_time     = EXCLUDED.start_time,
                    end_time       = EXCLUDED.end_time,
                    completed_time = EXCLUDED.completed_time,
                    priority       = EXCLUDED.priority
        `, [task.name, task.description, start, end, completed, priority])

        // ── 2. Sub-Tasks: alte löschen, neue anlegen ─────────────────────
        const oldSubs = await db.query(
            `SELECT sub_task_id FROM task_sub_tasks WHERE task_name = $1`,
            [task.name]
        )
        await db.query(`DELETE FROM task_sub_tasks WHERE task_name = $1`, [task.name])
        for (const { sub_task_id } of oldSubs.rows) {
            await db.query(`DELETE FROM sub_tasks WHERE id = $1`, [sub_task_id])
        }
        for (const sub of sub_tasks) {
            if (!sub.name) continue
            const res = await db.query(
                `INSERT INTO sub_tasks (name, is_completed) VALUES ($1, $2) RETURNING id`,
                [sub.name, sub.is_completed ?? false]
            )
            await db.query(
                `INSERT INTO task_sub_tasks (task_name, sub_task_id) VALUES ($1, $2)`,
                [task.name, res.rows[0].id]
            )
        }

        // ── 3. Tags: alte Verknüpfungen löschen, neue setzen ─────────────
        await db.query(`DELETE FROM task_tags WHERE task_name = $1`, [task.name])
        for (const tag of tags) {
            if (!tag.name) continue
            await db.query(
                `INSERT INTO tags (name, color) VALUES ($1, $2)
                 ON CONFLICT (name) DO UPDATE SET color = EXCLUDED.color`,
                [tag.name, tag.color]
            )
            await db.query(
                `INSERT INTO task_tags (task_name, tag_name) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [task.name, tag.name]
            )
        }
    } catch (e) {
        console.error("insertTask Fehler:", e)
        return { errors: { general: e.message } }
    }
}

// Alias – der View kann weiterhin updateTask aufrufen
export const updateTask = insertTask

export async function insertTestData(db) {
    if (!db) return
    try {
        const tags = [
            { name: 'Arbeit',      color: '#FF0000' },
            { name: 'Privat',      color: '#00FF00' },
            { name: 'Dringend',    color: '#FFA500' },
            { name: 'Planung',     color: '#0000FF' },
            { name: 'Entwicklung', color: '#800080' },
            { name: 'Meeting',     color: '#FFFF00' }
        ]
        for (const tag of tags) {
            await db.query(
                `INSERT INTO tags (name, color) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`,
                [tag.name, tag.color]
            )
        }

        const tasks = [
            { name: 'Website Redesign',        priority: '1', description: 'Neues Design für Website erstellen',  start: '2024-01-15 09:00:00+01', end: '2024-01-15 17:00:00+01' },
            { name: 'Dokumentation schreiben', priority: '2', description: 'API Dokumentation aktualisieren',      start: '2024-01-16 10:00:00+01', end: '2024-01-16 15:00:00+01' },
            { name: 'Team Meeting',            priority: '3', description: 'Wöchentliches Team Meeting',           start: '2024-01-17 14:00:00+01', end: '2024-01-17 15:00:00+01' }
        ]
        for (const task of tasks) {
            await db.query(
                `INSERT INTO tasks (name, description, start_time, end_time, completed_time, priority)
                 VALUES ($1, $2, $3, $4, NULL, $5) ON CONFLICT (name) DO NOTHING`,
                [task.name, task.description, task.start, task.end, task.priority]
            )
        }

        const subTasksData = [
            { task: 'Website Redesign',        name: 'Wireframes erstellen' },
            { task: 'Website Redesign',        name: 'Farbkonzept entwickeln' },
            { task: 'Dokumentation schreiben', name: 'README aktualisieren' },
            { task: 'Dokumentation schreiben', name: 'API Endpoints dokumentieren' },
            { task: 'Team Meeting',            name: 'Agenda vorbereiten' },
            { task: 'Team Meeting',            name: 'Meeting Minutes schreiben' }
        ]
        for (const sub of subTasksData) {
            const res = await db.query(
                `INSERT INTO sub_tasks (name, is_completed) VALUES ($1, false) RETURNING id`,
                [sub.name]
            )
            await db.query(
                `INSERT INTO task_sub_tasks (task_name, sub_task_id) VALUES ($1, $2)`,
                [sub.task, res.rows[0].id]
            )
        }

        const taskTags = [
            { task: 'Website Redesign',        tag: 'Arbeit' },
            { task: 'Website Redesign',        tag: 'Entwicklung' },
            { task: 'Website Redesign',        tag: 'Dringend' },
            { task: 'Dokumentation schreiben', tag: 'Arbeit' },
            { task: 'Dokumentation schreiben', tag: 'Planung' },
            { task: 'Dokumentation schreiben', tag: 'Entwicklung' },
            { task: 'Team Meeting',            tag: 'Arbeit' },
            { task: 'Team Meeting',            tag: 'Meeting' },
            { task: 'Team Meeting',            tag: 'Privat' }
        ]
        for (const tt of taskTags) {
            await db.query(
                `INSERT INTO task_tags (task_name, tag_name) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [tt.task, tt.tag]
            )
        }
        console.log("Testdaten erfolgreich eingefügt")
    } catch (error) {
        console.error("Fehler beim Einfügen der Testdaten:", error)
    }
}