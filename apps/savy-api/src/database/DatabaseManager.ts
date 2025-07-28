import Logger from "../logger/Logger";
import pool from "./pool";
import DatabaseSchema from "./schema/schema";
import devicesSchema from "./schema/devices";
import accountsSchema from "./schema/accounts";
import tournamentUsersSchema from "./schema/tournament_users";
import tournamentFleetsSchema from "./schema/tournament_fleets";

const logger = Logger.createWrapper("DatabaseManager");

export default class DatabaseManager {
  public static async initialiseTables(): Promise<void> {
    Logger.log("DatabaseManager", "Initialising database tables.");
    try {
      await this.initialiseTable(devicesSchema);
      await this.initialiseTable(accountsSchema);
      await this.initialiseTable(tournamentUsersSchema);
      await this.initialiseTable(tournamentFleetsSchema);
      logger.log("DatabaseManager", "All tables initialised successfully.");
    } catch (error) {
      logger.error(
        "DatabaseManager",
        "Error initialising database tables:",
        error
      );
      throw new Error("Failed to initialise database tables.");
    }
  }

  private static async initialiseTable(schema: DatabaseSchema): Promise<void> {
    const { name: tableName, schema: tableSchema } = schema;
    Logger.log("DatabaseManager", `Initialising table ${tableName}.`);
    const client = await pool.connect();
    await client.query(tableSchema);
  }
}
