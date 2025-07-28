import DatabaseSchema from "./schema";

const schema: DatabaseSchema = {
  name: "devices",
  schema: `
  CREATE TABLE IF NOT EXISTS devices (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    device_key TEXT NOT NULL,
    access_token TEXT DEFAULT NULL,
    last_login TEXT DEFAULT NULL
  );
`,
};

export default schema;
