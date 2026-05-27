const DB_LIST_KEY = "pglite_db_list"

// Alle gespeicherten DBs auslesen
export function getSavedDatabases() {
    const raw = localStorage.getItem(DB_LIST_KEY)
    return raw ? JSON.parse(raw) : []  // [{ dbName, userName }, ...]
}

// Neue DB registrieren
export function registerDatabase(dbName, userName) {
    const list = getSavedDatabases()
    list.push({ dbName, userName })
    localStorage.setItem(DB_LIST_KEY, JSON.stringify(list))
}

// Neue DB erstellen + Schema laden
export async function createDatabase(userName) {
    const { PGlite } = await import('@electric-sql/pglite')
    const { live } = await import('@electric-sql/pglite/live')
    const { loadSchema } = await import('./loadSchema.js')

    const dbName = `idb://pglite_${Date.now()}`
    const db = await PGlite.create({
        dataDir: dbName,
        extensions: {
            live
        }
    })
    await db.waitReady
    await loadSchema(db)
    await db.query(`INSERT INTO "user" (id, name) VALUES (1, $1)`, [userName])

    registerDatabase(dbName, userName)
    return db
}

// Bestehende DB öffnen
export async function openDatabase(dbName) {
    const { PGlite } = await import('@electric-sql/pglite')
    const { live } = await import('@electric-sql/pglite/live')

    return await PGlite.create({
        dataDir: dbName,
        extensions: {
            live
        }
    })
}