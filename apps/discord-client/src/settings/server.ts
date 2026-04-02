import { Snowflake } from "discord.js";
import Logger from "logger";
import { loadApplicationSettings, saveSettings } from "./application";

export interface MessageTheAdmiralsSettings {
  channelId: string | null;
}

export interface PermissionsSettings {
  configureSettings: Snowflake | null;
}

export interface ServerSettings {
  messageTheAdmirals: MessageTheAdmiralsSettings;
  permissions: PermissionsSettings;
}

const logger = Logger.createWrapper("ServerSettings");

export function createServerSettings(): ServerSettings {
  logger.info("Creating default server settings...");

  const settings: ServerSettings = {
    messageTheAdmirals: {
      channelId: null,
    },
    permissions: {
      configureSettings: null,
    },
  };

  logger.info("Default server settings created:", settings);
  return settings;
}

export function recoverValidServerSettings(
  settings: Partial<ServerSettings>,
): ServerSettings {
  if (isValidServerSettings(settings)) {
    return settings;
  }

  logger.warn("Invalid server settings found. Recovering valid fields.");
  const recoveredSettings = createServerSettings();

  if (settings.messageTheAdmirals) {
    if (typeof settings.messageTheAdmirals.channelId === "string") {
      recoveredSettings.messageTheAdmirals.channelId =
        settings.messageTheAdmirals.channelId;
      logger.info(
        "Recovered valid messageTheAdmirals settings:",
        recoveredSettings.messageTheAdmirals,
      );
    }

    if (typeof settings.permissions?.configureSettings === "string") {
      recoveredSettings.permissions.configureSettings =
        settings.permissions.configureSettings;
      logger.info(
        "Recovered valid permissions settings:",
        recoveredSettings.permissions,
      );
    }
  }

  return recoveredSettings;
}

export function isValidServerSettings(
  settings: unknown,
): settings is ServerSettings {
  if (typeof settings !== "object" || settings === null) {
    logger.warn("Settings is not an object:", settings);
    return false;
  }

  const testSettings = settings as ServerSettings;

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

export function resetServerSettings(serverId: Snowflake): ServerSettings {
  logger.log(`Resetting settings for server ${serverId} to default values.`);

  const defaultSettings = createServerSettings();
  saveServerSettings(serverId, defaultSettings);

  logger.info(
    `Settings for server ${serverId} have been reset:`,
    defaultSettings,
  );
  return defaultSettings;
}

export function saveServerSettings(
  serverId: Snowflake,
  serverSettings: ServerSettings,
): void {
  logger.info(`Saving settings for server ${serverId}:`, serverSettings);

  const settings = loadApplicationSettings();
  settings.servers.set(serverId, serverSettings);
  saveSettings(settings);

  logger.log(`Settings for server ${serverId} saved successfully.`);
}

export function updateSettingsForServer(
  serverId: Snowflake,
  newSettings: Partial<ServerSettings>,
): ServerSettings {
  logger.info(
    `Updating settings for server ${serverId} with new settings:`,
    newSettings,
  );

  const currentSettings = loadSettingsForServer(serverId);

  const updatedServerSettings: ServerSettings = {
    messageTheAdmirals: {
      channelId:
        newSettings.messageTheAdmirals?.channelId ??
        currentSettings.messageTheAdmirals.channelId,
    },
    permissions: {
      configureSettings:
        newSettings.permissions?.configureSettings ??
        currentSettings.permissions.configureSettings,
    },
  };

  saveServerSettings(serverId, updatedServerSettings);

  logger.info(
    `Updated settings for server ${serverId}:`,
    updatedServerSettings,
  );
  return updatedServerSettings;
}

export function loadSettingsForServer(serverId: Snowflake): ServerSettings {
  logger.log("Loading settings for server:", serverId);

  const settings = loadApplicationSettings();
  const existingSettings = settings.servers.get(serverId);

  if (!existingSettings) {
    logger.warn(
      `No settings found for server ${serverId}. Creating default settings.`,
    );
    const defaultSettings = createServerSettings();
    settings.servers.set(serverId, defaultSettings);
    saveSettings(settings);
    return defaultSettings;
  }

  if (!isValidServerSettings(existingSettings)) {
    logger.warn(
      `Invalid settings found for server ${serverId}. Attempting to recover valid fields.`,
    );

    const recoveredSettings = recoverValidServerSettings(existingSettings);
    saveServerSettings(serverId, recoveredSettings);

    logger.info(
      `Recovered settings for server ${serverId} saved successfully:`,
      recoveredSettings,
    );
    return recoveredSettings;
  }

  logger.info(
    `Settings for server ${serverId} loaded successfully:`,
    existingSettings,
  );
  return existingSettings;
}
