import fs from "fs";
import config from "../config";
import Logger from "logger";
import path from "path";

export interface MessageTheAdmiralsSettings {
  channelId: string | null;
}

export interface Settings {
  messageTheAdmirals: MessageTheAdmiralsSettings;
}

const logger = Logger.createWrapper("Settings");

export function createSettings(): Settings {
  logger.log("Creating default settings...");

  const settings: Settings = {
    messageTheAdmirals: {
      channelId: null,
    },
  };

  logger.log("Default settings created, saving them now:", settings);
  saveSettings(settings);

  return settings;
}

export function loadSettings(): Settings {
  logger.log("Loading settings from file...");

  if (!fs.existsSync(config.settingsPath)) {
    logger.warn("Settings file not found. Creating default settings.");

    const defaultSettings = createSettings();

    return defaultSettings;
  }

  const settingsData = fs.readFileSync(config.settingsPath, "utf-8");
  let settings: unknown;

  try {
    settings = JSON.parse(settingsData);
  } catch (error) {
    logger.error("Failed to parse settings file.");
  }

  if (isValidSettings(settings)) {
    logger.log("Settings loaded successfully:", settings);
    return settings;
  } else {
    logger.error("Invalid settings detected, creating a new configuration.");
    return createSettings();
  }
}

function createRuntimeDirectory(filePath: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.log(`Created runtime directory: ${dir}`);
  }
}

export function saveSettings(settings: Settings): void {
  logger.log(`Saving settings to file at ${config.settingsPath}:`, settings);

  createRuntimeDirectory(config.settingsPath);

  fs.writeFileSync(config.settingsPath, JSON.stringify(settings, null, 2));

  logger.log("Settings saved successfully.");
}

export function isValidSettings(settings: unknown): settings is Settings {
  if (typeof settings !== "object" || settings === null) {
    logger.warn("Settings is not an object:", settings);
    return false;
  }

  const testSettings = settings as Settings;

  if (
    typeof testSettings.messageTheAdmirals !== "object" ||
    testSettings.messageTheAdmirals === null
  ) {
    logger.warn(
      "Invalid messageTheAdmirals settings:",
      testSettings.messageTheAdmirals,
    );
    return false;
  }

  if (
    testSettings.messageTheAdmirals.channelId !== null &&
    typeof testSettings.messageTheAdmirals.channelId !== "string"
  ) {
    logger.warn(
      "Invalid channel ID in messageTheAdmirals settings:",
      testSettings.messageTheAdmirals.channelId,
    );
    return false;
  }

  return true;
}
