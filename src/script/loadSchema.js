const tags = `
    create table if not exists tags (
        name VARCHAR(200) PRIMARY KEY,
        color VARCHAR(7) NOT NULL CHECK (color ~ '^#[0-9A-Fa-f]{6}$')
        );
`;

const sub_tasks = `
    create table if not exists sub_tasks (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        is_completed BOOLEAN NOT NULL default false
    )
`;

const tasks = `
    create table if not exists tasks (
        name VARCHAR(200) PRIMARY KEY,
        description TEXT,
        start_time TIMESTAMPTZ,
        end_time TIMESTAMPTZ,
        completed_time TIMESTAMPTZ,
        priority VARCHAR(1) NOT NULL CHECK (priority ~ '^[1-5]$') default '1'
    );
`;

const task_tags = `
    create table if not exists task_tags (
        task_name VARCHAR(200) not null references tasks(name) on delete cascade,
        tag_name  VARCHAR(100) not null references tags(name)  on delete cascade,
        primary key (task_name, tag_name)
    );
`;

const task_sub_tasks = `
    create table if not exists task_sub_tasks (
        task_name VARCHAR(200) not null references tasks(name) on delete cascade,
        sub_task_id BIGINT not null references sub_tasks(id) on delete cascade,
        primary key (task_name, sub_task_id)
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
        await db.exec(tags);
        await db.exec(sub_tasks)
        await db.exec(tasks);
        await db.exec(task_tags);
        await db.exec(task_sub_tasks);
        await db.exec(user);

        console.log("successfully loaded schema");
    } catch (error) {
        console.log("error while loading schema: ", error);
    }
}