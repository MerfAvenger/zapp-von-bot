import { Pool, QueryConfig, QueryResult } from "pg";
import Logger from "logger";

const logger = Logger.createWrapper("makeQuery");

export async function makeQuery<TEntries>(
  pool: Pool,
  query: string,
  values: any[],
  validateData: (data: unknown) => boolean
): Promise<TEntries[] | null> {
  const client = await pool.connect();
  const queryConfig: QueryConfig = {
    text: query,
    values,
  };

  return await client
    .query(queryConfig)
    .then((data: QueryResult<TEntries>) => {
      if (data.rows.length === 0) {
        logger.warn("No data found:", queryConfig);
        return null;
      }

      const results = data.rows;

      const validResults = results.filter((result) => {
        const isValid = validateData(result);
        if (!isValid) {
          logger.warn("Invalid data found:", result, queryConfig);
        }
        return isValid;
      });

      if (validResults.length === 0) {
        logger.warn("No valid data found:", queryConfig);
        return null;
      }

      logger.log("Data retrieved successfully:", queryConfig, validResults);
      return validResults as TEntries;
    })
    .catch((error: Error) => {
      logger.error("Error executing query", queryConfig, error);
      return null;
    })
    .finally(() => {
      client.release();
    });
}
