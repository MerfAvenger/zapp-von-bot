import { EmbedBuilder, User } from "discord.js";
import { ERROR_COLOUR } from "../style";

export function buildErrorEmbed(error: ApplicationError) {
  return new EmbedBuilder()
    .setColor(ERROR_COLOUR)
    .setTitle(error.isPublic ? error.name : "Error processing command")
    .setDescription(
      error.publicDescription ??
        "An internal error occurred. Please contact an admin and try again later.",
    );
}

export function isApplicationError(error: unknown): error is ApplicationError {
  if (typeof error !== "object") {
    return false;
  }

  let testError = error as ApplicationError;

  if (!testError.name || typeof testError.name !== "string") {
    return false;
  }

  const isPublicDescriptor = Object.getOwnPropertyDescriptor(
    Object.getPrototypeOf(testError),
    "isPublic",
  );
  if (!isPublicDescriptor || !isPublicDescriptor.get) {
    return false;
  }

  return true;
}

export class ApplicationError extends Error {
  /**
   * A description of the error that can be shown to end users. If undefined, the error is considered an internal error and should not be shown to end users.
   */
  publicDescription?: string;

  get isPublic(): boolean {
    return this.publicDescription !== undefined;
  }
}

export class FailedToCreateDMChannelError extends ApplicationError {
  constructor(user: User, originalError: Error) {
    super(
      `Failed to create DM channel with user "${user.username}" [${user.id}]. Original error: ${originalError.message}`,
    );
    this.name = "FailedToCreateDMChannelError";
    this.publicDescription = `Failed to create a DM channel. Please make sure your privacy settings allow DMs from this bot.`;
  }
}

export class FailedToSendDMError extends ApplicationError {
  constructor(user: User, originalError: Error) {
    super(
      `Failed to send DM to user "${user.username}" [${user.id}]. Original error: ${originalError.message}`,
    );
    this.name = "FailedToSendDMError";
    this.publicDescription = `Failed to send a DM. Please make sure your privacy settings allow DMs from this bot.`;
  }
}

export class MissingConfigurationError extends ApplicationError {
  constructor(missingItem: string) {
    super(`"${missingItem}" is not configured.`);
    this.name = "MissingConfigurationError";
    this.publicDescription = `"${missingItem}" is not configured. Please get an admin to check your server settings.`;
  }
}

export class InvalidConfigurationError extends ApplicationError {
  constructor(invalidItem: string) {
    super(`${invalidItem} is not correctly configured.`);
    this.name = "InvalidConfigurationError";
    this.publicDescription = `${invalidItem} is not correctly configured. Please get an admin to check your server settings.`;
  }
}

export class InvalidCommandError extends ApplicationError {
  constructor(command: string) {
    super(`"${command}" is not a valid command.`);
    this.name = "InvalidCommandError";
    this.publicDescription = `"${command}" is not a valid command. Please try again with a valid command.`;
  }
}

export class PermissionDeniedError extends ApplicationError {
  constructor() {
    super(`You do not have permission to use this command.`);
    this.name = "PermissionDeniedError";
    this.publicDescription = `You do not have permission to use this command.`;
  }
}
