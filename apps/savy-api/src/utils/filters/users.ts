import { User } from "../../../../../packages/model/types";
import { Filter, Operator } from "./types";

export class NoAttacksUserFilter implements Filter<User> {
  name: string;

  constructor() {
    this.name = "No Attacks";
  }

  apply(users: User[]): User[] {
    return users.filter((user: User) => {
      return user.attacks === "0";
    });
  }
}
