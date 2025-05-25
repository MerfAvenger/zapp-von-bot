import { Pool, QueryConfig, QueryResult } from "pg";
import Logger from "../logger/Logger";

const SYSTEM_NAME = "makeQuery";

export async function makeQuery<TEntries>(
  pool: Pool,
  query: string,
  values: any[],
  validateData: (data: unknown) => boolean
): Promise<TEntries | null> {
  const client = await pool.connect();
  const queryConfig: QueryConfig = {
    text: query,
    values,
  };

  return await client
    .query(queryConfig)
    .then((data: QueryResult<TEntries>) => {
      if (data.rows.length === 0) {
        Logger.warn(SYSTEM_NAME, "No data found:", queryConfig);
        return null;
      }

      const results = data.rows;

      Logger.log(
        SYSTEM_NAME,
        "Data retrieved successfully:",
        queryConfig,
        results
      );
      const validResults = results.filter((result) => {
        const isValid = validateData(result);
        if (!isValid) {
          Logger.warn(SYSTEM_NAME, "Invalid data found:", result, queryConfig);
        }
        return isValid;
      });

      if (validResults.length === 0) {
        Logger.warn(SYSTEM_NAME, "No valid data found:", queryConfig);
        return null;
      }

      return results as TEntries;
    })
    .catch((error: Error) => {
      Logger.error(SYSTEM_NAME, "Error executing query", queryConfig, error);
      return null;
    })
    .finally(() => {
      client.release();
    });
}
