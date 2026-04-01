import { EmbedBuilder, User } from "discord.js";
import { ERROR_COLOUR } from "../style";

export function buildErrorEmbed(error: ApplicationError) {
  return new EmbedBuilder()
    .setColor(ERROR_COLOUR)
    .setTitle(error.name)
    .setDescription(error.message);
}

export function isApplicationError(error: unknown): error is ApplicationError {
  if (typeof error !== "object") {
    return false;
  }

  let testError = error as ApplicationError;

  if (!Object.hasOwn(testError, "isPublic")) {
    return false;
  }

  if (!Object.hasOwn(testError, "name")) {
    return false;
  }

  if (!Object.hasOwn(testError, "name")) {
    return false;
  }

  return true;
}

export class ApplicationError extends Error {
  isPublic = false;
}

export class FailedToSendDMError extends ApplicationError {
  constructor(user: User, originalError: Error) {
    super(
      `Failed to send DM to user ${user.username} [${user.id}]. Original error: ${originalError.message}`,
    );
    this.name = "FailedToSendDMError";
    this.isPublic = true;
  }
}

export class MissingConfigurationError extends ApplicationError {
  constructor(missingItem: string) {
    super(`"${missingItem}" is not configured.`);
    this.name = "MissingConfigurationError";
    this.isPublic = true;
  }
}

export class InvalidConfigurationError extends ApplicationError {
  constructor(invalidItem: string) {
    super(`${invalidItem} is not correctly configured.`);
    this.name = "InvalidConfigurationError";
    this.isPublic = true;
  }
}
