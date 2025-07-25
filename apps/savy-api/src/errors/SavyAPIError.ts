import { StatusCodes as HTTPCode } from "http-status-codes";

/**
 * @field code - The HTTP status code for the error.
 * @field reason - A user-friendly error message.
 * @field trace - The stack trace of the error, useful for debugging.
 */
export interface SavyAPIErrorOptions {
  code?: HTTPCode;
  reason?: string;
  trace?: typeof Error.prototype.stack;
}

export class SavyAPIError extends Error {
  code: HTTPCode;
  reason: string;

  /**
   * Creates a new SavyAPIError instance.
   *
   * @param message - An internal server error message for logging.
   * @param errorOptions - Optional error options to customize the error code, front facing error and stack trace.
   */
  constructor(message: string, errorOptions?: SavyAPIErrorOptions) {
    super(message);
    this.name = "SavyAPIError";
    this.code = errorOptions?.code || HTTPCode.INTERNAL_SERVER_ERROR;

    this.reason = errorOptions?.reason || "An unexpected error occurred.";
    errorOptions?.trace && (this.stack = errorOptions.trace);
  }
}

export class DeviceAuthenticationError extends SavyAPIError {
  constructor(message?: string, errorOptions?: SavyAPIErrorOptions) {
    super(message || "Device authentication failed.", errorOptions);
  }
}

export class FleetNotFoundError extends SavyAPIError {
  constructor(fleetName: string) {
    super(`Fleet not found: ${fleetName}.`, {
      code: HTTPCode.NOT_FOUND,
      reason: "The requested fleet could not be found.",
    });
  }
}

export class TooManyFleetsError extends SavyAPIError {
  constructor(fleetName: string) {
    super(`Too many fleets found: ${fleetName}.`, {
      code: HTTPCode.BAD_REQUEST,
      reason: "Multiple fleets found matching the search criteria.",
    });
  }
}

export class NoFleetUsersError extends SavyAPIError {
  constructor(fleetName: string) {
    super(`No users found for fleet: ${fleetName}.`, {
      code: HTTPCode.NOT_FOUND,
      reason: "Did not find any users for the requested fleet.",
    });
  }
}

export class FilterNotFoundError extends SavyAPIError {
  constructor(filterName: string) {
    super(`Filter not found: ${filterName}.`, {
      code: HTTPCode.NOT_FOUND,
      reason: "The requested filter could not be found.",
    });
  }
}
