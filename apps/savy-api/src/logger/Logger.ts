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
      } else if (arg instanceof Error) {
        errorifiable.push(arg);
      } else if (typeof arg === "object") {
        objectifiable.push(arg);
      }
    }

    return { stringifiable, objectifiable, errorifiable };
  }

  static #createTag(
    name: string,
    category: string,
    showTimestamp = true
  ): string {
    return `[${category}|${name}${showTimestamp ? `|${new Date().toISOString()}` : ""}]`;
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
}
