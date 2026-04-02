import { Guild, Snowflake, User } from "discord.js";
import Logger from "logger";
import { PermissionDeniedError } from "../error/errors";
import { loadApplicationSettings } from "../settings/application";

/**
 * Loads the server settings and returns whether the user has the required role to execute the command.
 *
 * @param guild
 * @param user
 * @param requiredRoleId An optional role ID that the user must have to execute the command. If not provided, only bot admins and the server owner will have permission.
 * @returns A boolean indicating whether the user has the required permissions.
 */
export function hasRequiredPermissions(
  guild: Guild,
  user: User,
  authorisedRoles?: Snowflake[],
): boolean {
  if (
    guild.members
      .fetch(user.id)
      .then((member) => {
        if (member.id === guild.ownerId || isBotAdmin(member.id)) {
          Logger.info(
            "PermissionCheck",
            `User "${user.username}" [${user.id}] is the server owner or a bot admin and has super user permissions.`,
          );
          return true;
        }

        if (authorisedRoles?.some((roleId) => member.roles.cache.has(roleId))) {
          Logger.info(
            "PermissionCheck",
            `User "${user.username}" [${user.id}] has required permissions via configured roles.`,
          );
          return true;
        }

        Logger.warn(
          "PermissionCheck",
          `User "${user.username}" [${user.id}] does not have the required permissions. Required role IDs: ${authorisedRoles?.join(
            ", ",
          )}. User role IDs: ${member.roles.cache
            .map((role) => role.id)
            .join(", ")}.`,
        );
        return false;
      })
      .catch((error) => {
        Logger.error(
          "PermissionCheck",
          `Failed to fetch member data for user "${user.username}" [${user.id}]:`,
          error,
        );
        return false;
      })
  )
    return true;
}

/**
 * Asserts that the user has the required role to execute the command. Throws a PermissionDeniedError if the user does not have the required permissions.
 *
 * @param guild
 * @param user
 * @param requiredRoleId An optional role ID that the user must have to execute the command. If not provided, only bot admins and the server owner will have permission.
 * @throws {PermissionDeniedError} If the user does not have the required permissions.
 */
export function assertHasRequiredPermissions(
  guild: Guild,
  user: User,
  authorisedRoles?: Snowflake[],
): void {
  if (!hasRequiredPermissions(guild, user, authorisedRoles)) {
    throw new PermissionDeniedError();
  }
}

export function isBotAdmin(userId: string): boolean {
  const { admins } = loadApplicationSettings();
  return admins.includes(userId);
}
