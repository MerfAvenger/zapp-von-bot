import { ServerSettings } from "../../../../../settings/server";
import { formatChannel, formatRoles } from "./formatting";

/**
 * Configuration for how to display each setting field.
 */
interface SettingDisplayConfig {
  label: string;
  getValue: (settings: ServerSettings) => string;
}

/**
 * Defines how each setting should be displayed in the view command.
 * Add new settings here as they are added to ServerSettings.
 */
const settingConfigs: SettingDisplayConfig[] = [
  {
    label: "Admin Roles",
    getValue: (settings) => formatRoles(settings.permissions.adminRoles),
  },
  {
    label: "Message The Admirals Channel",
    getValue: (settings) =>
      formatChannel(settings.messageTheAdmirals.channelId),
  },
];

/**
 * Builds the complete settings message by processing all configured settings.
 */
export function buildSettingsMessage(settings: ServerSettings): string {
  const lines = ["**Current Bot Settings:**", ""];

  for (const config of settingConfigs) {
    const value = config.getValue(settings);
    lines.push(`**${config.label}:** ${value}`);
  }

  return lines.join("\n");
}
