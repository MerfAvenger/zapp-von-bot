import pool from "./pool";
import { GET_ACCOUNT_BY_NAME, INSERT_ACCOUNT } from "./queries/account";

import accounts from "./fixtures/accounts.json";
import { QueryConfig } from "pg";

if (!accounts || !Array.isArray(accounts)) {
  throw new Error("Invalid accounts fixture data");
}

function hasAccounts() {
  const hasAccountQueries = accounts.map((account): QueryConfig => {
    return {
      text: GET_ACCOUNT_BY_NAME,
      values: [account.name],
    };
  });

  const hasAccountResults = hasAccountQueries.map((hasAccountQueries) => true);
}

function setupAccounts() {
  const queries = accounts.map((account): QueryConfig => {
    return {
      text: INSERT_ACCOUNT,
      values: [account.name, account.email, account.password],
    };
  });
}

export default async function setupFixtures(): Promise<void> {
  await pool
    .query("BEGIN")
    .then(() => {
      const queries = accounts.map(
        (account) =>
          `INSERT INTO accounts (name, created_at) VALUES ('${account.name}', NOW())`
      );
      return pool.query(queries.join("; "));
    })
    .then(() => pool.query("COMMIT"))
    .catch((error) => {
      console.error("Error setting up fixtures:", error);
      return pool.query("ROLLBACK");
    });
}
