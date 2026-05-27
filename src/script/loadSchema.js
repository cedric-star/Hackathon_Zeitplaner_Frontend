const categories = `
    create table if not exists tags (
                                        name VARCHAR(200) PRIMARY KEY,
        color VARCHAR(7) NOT NULL CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
        );
`;

const tasks = `
    create table if not exists tasks (
                                         name VARCHAR(200) PRIMARY KEY,
        description TEXT,
        start_time TIMESTAMPTZ,
        end_time TIMESTAMPTZ
        );
`;

const task_tags = `
    create table if not exists task_tags (
                                             task_name VARCHAR(200) not null references tasks(name) on delete cascade,
        tag_name  VARCHAR(100) not null references tags(name)  on delete cascade,
        primary key (task_name, tag_name)
        );
`;

const user = `
    create table if not exists "user" (
                                          id INT PRIMARY KEY default 1,
                                          name VARCHAR(200) not null,
        constraint single_row_check CHECK (id = 1)
        )
`;

export async function loadSchema(db) {
    try {
        await db.exec(categories);
        await db.exec(tasks);
        await db.exec(task_tags);
        await db.exec(user);

        console.log("successfully loaded schema");
    } catch (error) {
        console.log("error while loading schema: ", error);
    }
}