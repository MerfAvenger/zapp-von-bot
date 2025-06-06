CREATE TABLE devices (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    device_key TEXT NOT NULL,
    access_token TEXT DEFAULT NULL,
    last_login TEXT DEFAULT NULL
);

CREATE TABLE accounts (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);