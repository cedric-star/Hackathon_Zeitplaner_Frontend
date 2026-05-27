export async function getTasks(db) {
    if (!db) return

    const query = `
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
    `

    const result = await db.query(query)
    console.log(result.rows)
    return result.rows
}



export async function insertTestData(db) {
    if (!db) return

    try {
        // 1. Tags erstellen
        const tags = [
            { name: 'Arbeit', color: '#FF0000' },
            { name: 'Privat', color: '#00FF00' },
            { name: 'Dringend', color: '#FFA500' },
            { name: 'Planung', color: '#0000FF' },
            { name: 'Entwicklung', color: '#800080' },
            { name: 'Meeting', color: '#FFFF00' }
        ]

        for (const tag of tags) {
            await db.query(`INSERT INTO tags (name, color) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`,
                [tag.name, tag.color])
        }

        // 2. Tasks erstellen
        const tasks = [
            { name: 'Website Redesign', priority: '1', description: 'Neues Design für Website erstellen', start: '2024-01-15 09:00:00+01', end: '2024-01-15 17:00:00+01' },
            { name: 'Dokumentation schreiben', priority: '2', description: 'API Dokumentation aktualisieren', start: '2024-01-16 10:00:00+01', end: '2024-01-16 15:00:00+01' },
            { name: 'Team Meeting', priority: '3', description: 'Wöchentliches Team Meeting', start: '2024-01-17 14:00:00+01', end: '2024-01-17 15:00:00+01' }
        ]

        for (const task of tasks) {
            await db.query(
                `INSERT INTO tasks (name, description, start_time, end_time, completed_time, priority)
                 VALUES ($1, $2, $3, $4, NULL, $5)`,
                [task.name, task.description, task.start, task.end, task.priority]
            )
        }

        // 3. Sub-Tasks für jeden Task erstellen
        const subTasksData = [
            // Für Website Redesign
            { task: 'Website Redesign', name: 'Wireframes erstellen' },
            { task: 'Website Redesign', name: 'Farbkonzept entwickeln' },
            // Für Dokumentation schreiben
            { task: 'Dokumentation schreiben', name: 'README aktualisieren' },
            { task: 'Dokumentation schreiben', name: 'API Endpoints dokumentieren' },
            // Für Team Meeting
            { task: 'Team Meeting', name: 'Agenda vorbereiten' },
            { task: 'Team Meeting', name: 'Meeting Minutes schreiben' }
        ]

        for (const sub of subTasksData) {
            // Sub-Task erstellen
            const result = await db.query(
                `INSERT INTO sub_tasks (name, is_completed) VALUES ($1, false) RETURNING id`,
                [sub.name]
            )
            const subTaskId = result.rows[0].id

            // Mit Task verknüpfen
            await db.query(
                `INSERT INTO task_sub_tasks (task_name, sub_task_id) VALUES ($1, $2)`,
                [sub.task, subTaskId]
            )
        }

        // 4. Tags den Tasks zuweisen
        const taskTags = [
            // Website Redesign Tags
            { task: 'Website Redesign', tag: 'Arbeit' },
            { task: 'Website Redesign', tag: 'Entwicklung' },
            { task: 'Website Redesign', tag: 'Dringend' },
            // Dokumentation schreiben Tags
            { task: 'Dokumentation schreiben', tag: 'Arbeit' },
            { task: 'Dokumentation schreiben', tag: 'Planung' },
            { task: 'Dokumentation schreiben', tag: 'Entwicklung' },
            // Team Meeting Tags
            { task: 'Team Meeting', tag: 'Arbeit' },
            { task: 'Team Meeting', tag: 'Meeting' },
            { task: 'Team Meeting', tag: 'Privat' }
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