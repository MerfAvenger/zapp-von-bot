import { inspect } from "util";
import { LogArguments } from "../types/Logger";
import moment from "moment";

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
    showTimestamp = true
  ): string {
    return `[${category}|${name}${showTimestamp ? `|${moment.utc().format("DD-MM-YY|HH:mm:ss:SSS")}` : ""}]`;
  }

  public static log(
    systemName: string,
    message: string,
    ...args: unknown[]
  ): void {
    const tag = this.#createTag(systemName, "LOG");
    const { stringifiable, objectifiable, errorifiable } =
      this.#parseArgs(args);
    console.log(`${tag}`, message, ...stringifiable);

    if (objectifiable.length > 0) {
      console.log(tag, inspect(objectifiable));
    }

    if (errorifiable.length > 0) {
      for (const error of errorifiable) {
        if (error) {
          console.error(`${tag}`, error);
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
    console.warn(`${tag}`, message, ...stringifiable);

    if (objectifiable.length > 0) {
      console.warn(tag, inspect(objectifiable));
    }

    if (errorifiable.length > 0) {
      for (const error of errorifiable) {
        if (error) {
          console.error(`${tag}`, error);
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
    console.error(`${tag}`, message, ...stringifiable);

    if (objectifiable.length > 0) {
      console.error(tag, inspect(objectifiable));
    }

    if (errorifiable.length > 0) {
      for (const error of errorifiable) {
        if (error) {
          console.error(`${tag}`, error);
        }
      }
    }
  }

  /**
   * Creates a logging wrapper to make using the logger with metadata easier.
   *
   * @param systemName The name of the system or module for which the logger is being created.
   * @returns A wrapper object with `log`, `warn`, and `error` methods that automatically include the system name in the log messages.
   */
  public static createWrapper(systemName: string): {
    log: (message: string, ...args: unknown[]) => void;
    warn: (message: string, ...args: unknown[]) => void;
    error: (message: string, ...args: unknown[]) => void;
  } {
    return {
      log: (message: string, ...args: unknown[]) =>
        this.log(systemName, message, ...args),
      warn: (message: string, ...args: unknown[]) =>
        this.warn(systemName, message, ...args),
      error: (message: string, ...args: unknown[]) =>
        this.error(systemName, message, ...args),
    };
  }
}
