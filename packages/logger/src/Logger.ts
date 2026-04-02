import { inspect } from "util";
import moment from "moment";

const COLOURS = {
  log: "\x1b[37m",
  info: "\x1b[90m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
  reset: "\x1b[0m",
};

export type LogArguments = {
  stringifiable: Array<string | number | boolean>;
  objectifiable: Array<object | null>;
  errorifiable: Array<Error | null>;
};

export default class Logger {
  static #parseArgs(args: unknown[]): LogArguments {
    const stringifiable: Array<string | number | boolean> = [];
    const objectifiable: Array<object> = [];
    const errorifiable: Array<Error | null> = [];

    for (const arg of args) {
      if (
        typeof arg === "string" ||
        typeof arg === "number" ||
        typeof arg === "boolean"
      ) {
        stringifiable.push(arg);
      } else if (arg instanceof Error) {
        errorifiable.push(arg);
      } else if (typeof arg === "object") {
        objectifiable.push(arg);
      }
    }

    return { stringifiable, objectifiable, errorifiable };
  }

  /**
   * Creates a formatted tag for log messages.
   *
   * @param name The name of the system or module.
   * @param category The category of the log message (e.g., "LOG", "WARN", "ERROR").
   * @param showTimestamp Whether to include a timestamp in the tag.
   * @returns A formatted tag string.
   */
  static #createTag(
    name: string,
    category: string,
    showTimestamp = true,
  ): string {
    return `[${category}|${name}${
      showTimestamp ? `|${moment.utc().format("DD-MM-YY|HH:mm:ss:SSS")}` : ""
    }]`;
  }

  public static log(
    systemName: string,
    message: string,
    ...args: unknown[]
  ): void {
    const tag = this.#createTag(systemName, "LOG");
    const { stringifiable, objectifiable, errorifiable } =
      this.#parseArgs(args);
    const stringifiedArgs =
      stringifiable.length > 0 ? ` ${stringifiable.join(" ")}` : "";
    console.log(
      `${COLOURS.log}${tag} ${message}${stringifiedArgs}${COLOURS.reset}`,
    );

    if (objectifiable.length > 0) {
      const stringifiedObjects = inspect(objectifiable);
      console.log(`${COLOURS.log}${tag} ${stringifiedObjects}${COLOURS.reset}`);
    }

    if (errorifiable.length > 0) {
      for (const error of errorifiable) {
        if (error) {
          console.error(`${COLOURS.error}${tag} ${error}${COLOURS.reset}`);
        }
      }
    }
  }

  public static info(
    systemName: string,
    message: string,
    ...args: unknown[]
  ): void {
    const tag = this.#createTag(systemName, "INFO");
    const { stringifiable, objectifiable, errorifiable } =
      this.#parseArgs(args);
    const stringifiedArgs =
      stringifiable.length > 0 ? ` ${stringifiable.join(" ")}` : "";
    console.log(
      `${COLOURS.info}${tag} ${message}${stringifiedArgs}${COLOURS.reset}`,
    );

    if (objectifiable.length > 0) {
      const stringifiedObjects = inspect(objectifiable);
      console.log(
        `${COLOURS.info}${tag} ${stringifiedObjects}${COLOURS.reset}`,
      );
    }

    if (errorifiable.length > 0) {
      for (const error of errorifiable) {
        if (error) {
          console.error(`${COLOURS.error}${tag} ${error}${COLOURS.reset}`);
        }
      }
    }
  }

  public static warn(
    systemName: string,
    message: string,
    ...args: unknown[]
  ): void {
    const tag = this.#createTag(systemName, "WARN");
    const { stringifiable, objectifiable, errorifiable } =
      this.#parseArgs(args);
    const stringifiedArgs =
      stringifiable.length > 0 ? ` ${stringifiable.join(" ")}` : "";
    console.warn(
      `${COLOURS.warn}${tag} ${message}${stringifiedArgs}${COLOURS.reset}`,
    );

    if (objectifiable.length > 0) {
      const stringifiedObjects = inspect(objectifiable);
      console.warn(
        `${COLOURS.warn}${tag} ${stringifiedObjects}${COLOURS.reset}`,
      );
    }

    if (errorifiable.length > 0) {
      for (const error of errorifiable) {
        if (error) {
          console.error(`${COLOURS.error}${tag} ${error}${COLOURS.reset}`);
        }
      }
    }
  }

  public static error(
    systemName: string,
    message: string,
    ...args: unknown[]
  ): void {
    const tag = this.#createTag(systemName, "ERROR");
    const { stringifiable, objectifiable, errorifiable } =
      this.#parseArgs(args);
    const stringifiedArgs =
      stringifiable.length > 0 ? ` ${stringifiable.join(" ")}` : "";
    console.error(
      `${COLOURS.error}${tag} ${message}${stringifiedArgs}${COLOURS.reset}`,
    );

    if (objectifiable.length > 0) {
      const stringifiedObjects = inspect(objectifiable);
      console.error(
        `${COLOURS.error}${tag} ${stringifiedObjects}${COLOURS.reset}`,
      );
    }

    if (errorifiable.length > 0) {
      for (const error of errorifiable) {
        if (error) {
          console.error(`${COLOURS.error}${tag} ${error}${COLOURS.reset}`);
        }
      }
    }
  }

  /**
   * Creates a logging wrapper to make using the logger with metadata easier.
   *
   * @param systemName The name of the system or module for which the logger is being created.
   * @returns A wrapper object with `log`, `info`, `warn`, and `error` methods that automatically include the system name in the log messages.
   */
  public static createWrapper(systemName: string): {
    log: (message: string, ...args: unknown[]) => void;
    info: (message: string, ...args: unknown[]) => void;
    warn: (message: string, ...args: unknown[]) => void;
    error: (message: string, ...args: unknown[]) => void;
  } {
    return {
      log: (message: string, ...args: unknown[]) =>
        this.log(systemName, message, ...args),
      info: (message: string, ...args: unknown[]) =>
        this.info(systemName, message, ...args),
      warn: (message: string, ...args: unknown[]) =>
        this.warn(systemName, message, ...args),
      error: (message: string, ...args: unknown[]) =>
        this.error(systemName, message, ...args),
    };
  }
}
