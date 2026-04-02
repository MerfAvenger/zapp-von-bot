import fs from "fs";
import config from "../config";
import Logger from "logger";
import path from "path";
import { Snowflake } from "discord.js";
import { ServerSettings } from "./server";

export type ApplicationServerSettings = Map<Snowflake, ServerSettings>;
export interface ApplicationSettings {
  admins: Snowflake[];
  servers: ApplicationServerSettings;
}

const logger = Logger.createWrapper("Settings");

function createRuntimeDirectory(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.log(`Created runtime directory: ${dir}`);
  }
}

export function saveSettings(settings: ApplicationSettings): void {
  logger.log(`Saving settings to file at ${config.settingsPath}:`, settings);
  createRuntimeDirectory(config.settingsPath);

  let serialisedSettings = {
    admins: settings.admins,
    servers: Object.fromEntries(settings.servers),
  };
  fs.writeFileSync(
    config.settingsPath,
    JSON.stringify(serialisedSettings, null, 2),
  );

  logger.log("Settings saved successfully.");
}

export function createSettings(): ApplicationSettings {
  logger.log("Creating default application settings...");
  const serverSettings: ApplicationServerSettings = new Map<
    Snowflake,
    ServerSettings
  >();

  const applicationSettings: ApplicationSettings = {
    admins: config.botAdmins,
    servers: serverSettings,
  };

  saveSettings(applicationSettings);

  logger.log(
    "Default application settings created and saved:",
    applicationSettings,
  );
  return applicationSettings;
}

export function loadApplicationSettings(): ApplicationSettings {
  logger.log("Loading application settings from file...");

  if (!fs.existsSync(config.settingsPath)) {
    logger.warn(
      `Settings file not found at ${config.settingsPath}. Creating default settings...`,
    );

    return createSettings();
  }

  let settingsData: ApplicationSettings;

  try {
    const data = fs.readFileSync(config.settingsPath, "utf-8");
    const parsedData = JSON.parse(data);
    settingsData = parsedData as ApplicationSettings;
  } catch (error) {
    logger.warn("Error reading or parsing application settings file:", error);
    return createSettings();
  }

  let deserialisedSettings: ApplicationSettings = {
    admins: settingsData.admins,
    servers: new Map(Object.entries(settingsData.servers)),
  };

  validateApplicationSettings(deserialisedSettings);

  logger.log("Application settings loaded successfully:", deserialisedSettings);
  return deserialisedSettings;
}

export function validateApplicationSettings(
  settings: unknown,
): ApplicationSettings {
  if (typeof settings !== "object" || settings === null) {
    logger.warn("Settings is not an object:", settings);

    const settingsData = createSettings();
    saveSettings(settingsData);

    return settingsData;
  }

  let testSettings = settings as ApplicationSettings;

  if (
    !Object.hasOwn(settings, "admins") ||
    !Array.isArray(testSettings.admins)
  ) {
    logger.warn(
      "Settings is missing 'admins' property or it is not an array:",
      settings,
    );

    const settingsData = createSettings();

    if (testSettings.servers.size > 0) {
      logger.warn(
        "Preserving existing server settings while resetting admins.",
        Array.from(testSettings.servers.entries()),
      );
      settingsData.servers = testSettings.servers;
    }

    saveSettings(settingsData);

    return settingsData;
  }
}
