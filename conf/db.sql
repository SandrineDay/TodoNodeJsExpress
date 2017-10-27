CREATE SCHEMA mytodos;

CREATE TABLE mytodos.TodoList
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    body LONGTEXT NOT NULL,
    is_urgent BOOLEAN NOT NULL,
    deadline DATE,
    is_checked BOOLEAN NOT NULL,
    created_at DATE,
    modified_at DATE
);
CREATE UNIQUE INDEX TodoList_id_uindex ON TodoList (id);

CREATE TABLE mytodos.users
(
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    email VARCHAR(25) NOT NULL,
    password VARCHAR(255) NOT NULL
);
CREATE UNIQUE INDEX users_id_uindex ON users (id);
CREATE UNIQUE INDEX users_email_uindex ON users (email);