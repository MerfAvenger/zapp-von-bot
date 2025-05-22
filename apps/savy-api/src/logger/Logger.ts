import { inspect } from "util";
import { LogArguments } from "../types/Logger";

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
      } else if (typeof arg === "object" && arg !== null) {
        objectifiable.push(arg);
      } else if (arg instanceof Error) {
        errorifiable.push(arg);
      }
    }

    return { stringifiable, objectifiable, errorifiable };
  }

  public static log(systemName: string, ...args: unknown[]): void {
    const { stringifiable, objectifiable, errorifiable } =
      this.#parseArgs(args);
    console.log(`[${systemName}]`, ...stringifiable);

    if (objectifiable.length > 0) {
      inspect({ category: "LOG", system: `${systemName}`, objectifiable });
    }

    if (errorifiable.length > 0) {
      for (const error of errorifiable) {
        if (error) {
          console.error(`[${systemName}]`, error);
        }
      }
    }
  }

  public static warn(systemName: string, ...args: unknown[]): void {
    const { stringifiable, objectifiable, errorifiable } =
      this.#parseArgs(args);
    console.warn(`[${systemName}]`, ...stringifiable);

    if (objectifiable.length > 0) {
      inspect({ category: "WARN", system: `${systemName}`, objectifiable });
    }

    if (errorifiable.length > 0) {
      for (const error of errorifiable) {
        if (error) {
          console.error(`[${systemName}]`, error);
        }
      }
    }
  }

  public static error(systemName: string, ...args: unknown[]): void {
    const { stringifiable, objectifiable, errorifiable } =
      this.#parseArgs(args);
    console.error(`[${systemName}]`, ...stringifiable);

    if (objectifiable.length > 0) {
      inspect({ category: "ERROR", system: `${systemName}`, objectifiable });
    }

    if (errorifiable.length > 0) {
      for (const error of errorifiable) {
        if (error) {
          console.error(`[${systemName}]`, error);
        }
      }
    }
  }
}
