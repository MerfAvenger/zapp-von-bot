import Logger from "logger";
import pool from "./pool";
import DatabaseSchema from "./schema/schema";
import devicesSchema from "./schema/devices";
import accountsSchema from "./schema/accounts";
import tournamentUsersSchema from "./schema/tournament_users";
import tournamentFleetsSchema from "./schema/tournament_fleets";
import { existsSync, readFileSync } from "fs";
import { makeQuery } from "./query";
import { inspect } from "util";

const logger = Logger.createWrapper("DatabaseManager");

export default class DatabaseManager {
  // public static async initialiseTables(): Promise<void> {
  //   logger.log("DatabaseManager", "Initialising database tables.");
  //   try {
  //     await this.initialiseTable(devicesSchema);
  //     await this.initialiseTable(accountsSchema);
  //     await this.initialiseTable(tournamentUsersSchema);
  //     await this.initialiseTable(tournamentFleetsSchema);
  //     logger.log("DatabaseManager", "All tables initialised successfully.");
  //   } catch (error) {
  //     logger.error(
  //       "DatabaseManager",
  //       "Error initialising database tables:",
  //       error
  //     );
  //     throw new Error("Failed to initialise database tables.");
  //   }
  // }
  // private static async initialiseTable(schema: DatabaseSchema): Promise<void> {
  //   const { name: tableName, schema: tableSchema } = schema;
  //   logger.log(`Initialising table ${tableName}.`);
  //   const client = await pool.connect();
  //   await client.query(tableSchema);
  //   logger.log(
  //     "Inserting fixture data for table:",
  //     tableName,
  //     inspect({ fixtureData })
  //   );
  //   for (const data of fixtureData) {
  //     const columns = Object.keys(data).join(", ");
  //     const placeholders = Object.keys(data)
  //       .map((_, index) => `$${index + 1}`)
  //       .join(", ");
  //     const values = Object.values(data);
  //     await makeQuery(
  //       pool,
  //       `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`,
  //       values,
  //       () => true
  //     );
  //   }
  // }
  // private static async checkFixturesLoaded(
  //   tableName: string,
  //   fixtures: object
  // ): Promise<boolean> {
  // }
}
