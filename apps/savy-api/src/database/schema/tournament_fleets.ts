import DatabaseSchema from "./schema";

const schema: DatabaseSchema = {
  name: "tournament_fleets",
  schema: `
  CREATE TABLE IF NOT EXISTS tournament_fleets (
    id TEXT UNIQUE NOT NULL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    stars TEXT DEFAULT NULL,
    division TEXT DEFAULT NULL,
    hour INTEGER DEFAULT 0,
    day INTEGER DEFAULT 1,
    month INTEGER DEFAULT 1,
    year INTEGER DEFAULT 2025,
    trophies TEXT DEFAULT NULL,
    number_of_users TEXT DEFAULT NULL
  );
`,
};

export default schema;
