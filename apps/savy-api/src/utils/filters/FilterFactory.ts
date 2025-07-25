import { FilterNotFoundError } from "../../errors/SavyAPIError";
import { Filter } from "./types";
import { NoAttacksUserFilter } from "./users";

export class FilterFactory {
  static createFilter<TData>(name: string): Filter<TData> {
    switch (name) {
      case "No Attacks":
        return new NoAttacksUserFilter() as Filter<TData>;
      // Add more filters as needed
      default:
        throw new FilterNotFoundError(name);
    }
  }
}
