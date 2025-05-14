CREATE TABLE devices (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    device_key TEXT NOT NULL,
    access_token TEXT NOT NULL,
    last_login TEXT DEFAULT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    account TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
);