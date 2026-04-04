import { Snowflake } from "discord.js";

/**
 * Formats a single role ID as a Discord mention tag.
 */
export function formatRole(roleId: Snowflake | null): string {
  if (!roleId) {
    return "Not set";
  }
  return `<@&${roleId}>`;
}

/**
 * Formats multiple role IDs as Discord mention tags.
 */
export function formatRoles(roleIds: Snowflake[] | null): string {
  if (!roleIds || roleIds.length === 0) {
    return "Not set";
  }
  return roleIds.map(formatRole).join(", ");
}

/**
 * Formats a single channel ID as a Discord mention tag.
 */
export function formatChannel(channelId: Snowflake | null): string {
  if (!channelId) {
    return "Not set";
  }
  return `<#${channelId}>`;
}

/**
 * Formats multiple channel IDs as Discord mention tags.
 */
export function formatChannels(channelIds: Snowflake[] | null): string {
  if (!channelIds || channelIds.length === 0) {
    return "Not set";
  }
  return channelIds.map(formatChannel).join(", ");
}

/**
 * Formats a single user ID as a Discord mention tag.
 */
export function formatUser(userId: Snowflake | null): string {
  if (!userId) {
    return "Not set";
  }
  return `<@${userId}>`;
}

/**
 * Formats multiple user IDs as Discord mention tags.
 */
export function formatUsers(userIds: Snowflake[] | null): string {
  if (!userIds || userIds.length === 0) {
    return "Not set";
  }
  return userIds.map(formatUser).join(", ");
}

/**
 * Formats a boolean value as a human-readable string.
 */
export function formatBoolean(value: boolean | null): string {
  if (value === null) {
    return "Not set";
  }
  return value ? "Enabled" : "Disabled";
}

/**
 * Formats a generic string value, showing "Not set" if null/empty.
 */
export function formatString(value: string | null): string {
  if (!value) {
    return "Not set";
  }
  return value;
}
