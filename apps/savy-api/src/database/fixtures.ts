import { existsSync, readFileSync } from "fs";
import Logger from "../logger/Logger";

export interface FixtureData {
  query: string;
  values: any[];
}

export async function setupFixtures(
  tableName: string,
  fixtures: object
): Promise<void> {}

function parseFixtureToPostgres(
  tableName: string,
  fixtures: object
): FixtureData {
  const columns = Object.keys(fixtures).join(", ");
  const placeholders = Object.keys(fixtures)
    .map((_, index) => `$${index + 1}`)
    .join(", ");
  const values = Object.values(fixtures);

  return {
    query: `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders}) RETURNING *;`,
    values,
  };
}

function loadFixturesFromFile(tableName: string): object[] | null {
  const fixturePath = `${__dirname}/fixtures/${tableName}.json`;

  if (!existsSync(fixturePath)) {
    Logger.warn(
      "LoadFixturesFromFile",
      `No fixture file for table ${tableName}.`
    );
    return;
  }

  const fixtures = readFileSync(fixturePath, { encoding: "utf-8" });
  return JSON.parse(fixtures);
}

// function hasFixtures()