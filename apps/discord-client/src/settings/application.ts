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

// In-memory cache to avoid repeated disk reads
let settingsCache: ApplicationSettings | null = null;

function createRuntimeDirectory(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.info(`Created runtime directory: ${dir}`);
  }
}

export function saveSettings(settings: ApplicationSettings): void {
  logger.info(`Saving settings to file at ${config.settingsPath}:`, settings);
  createRuntimeDirectory(config.settingsPath);

  let serialisedSettings = {
    admins: settings.admins,
    servers: Object.fromEntries(settings.servers),
  };
  fs.writeFileSync(
    config.settingsPath,
    JSON.stringify(serialisedSettings, null, 2),
  );

  // Update cache after saving
  settingsCache = settings;

  logger.log("Settings saved successfully.");
}

export function createSettings(): ApplicationSettings {
  logger.info("Creating default application settings...");
  const serverSettings: ApplicationServerSettings = new Map<
    Snowflake,
    ServerSettings
  >();

  const applicationSettings: ApplicationSettings = {
    admins: config.botAdmins,
    servers: serverSettings,
  };

  saveSettings(applicationSettings);

  logger.info(
    "Default application settings created and saved:",
    applicationSettings,
  );
  return applicationSettings;
}

export function loadApplicationSettings(): ApplicationSettings {
  // Return cached settings if available
  if (settingsCache !== null) {
    logger.info("Loading application settings from cache.");
    return settingsCache;
  }

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

  // Cache the loaded settings
  settingsCache = deserialisedSettings;

  logger.info(
    "Application settings loaded successfully:",
    deserialisedSettings,
  );
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

/**
 * Invalidates the settings cache, forcing the next call to loadApplicationSettings to read from disk.
 * Useful for testing or if external processes modify the settings file.
 */
export function invalidateSettingsCache(): void {
  logger.info("Invalidating settings cache.");
  settingsCache = null;
}
