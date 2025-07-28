import DatabaseSchema from "./schema";

const schema: DatabaseSchema = {
  name: "accounts",
  schema: `
  CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    -- Regretably, we need to use the actual password as received by the Pixel Starships API.
    -- Instead we'll take measures to ensure that we don't leak passwords and only define them as secrets in the environment, as well as encourage usage of the app to only use bot accounts instead of valuable personal ones.
    password TEXT NOT NULL
  );
`,
};

export default schema;
