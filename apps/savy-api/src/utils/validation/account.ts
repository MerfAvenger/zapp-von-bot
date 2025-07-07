import { Account } from "../../../../../packages/model/types";

export function isValidAccount(account: unknown): account is Account {
  if (typeof account !== "object" || account === null) {
    return false;
  }

  const testAccount = account as Account;

  if (typeof testAccount.id !== "string") {
    return false;
  }

  if (typeof testAccount.name !== "string") {
    return false;
  }

  if (typeof testAccount.email !== "string") {
    return false;
  }

  if (typeof testAccount.password !== "string") {
    return false;
  }

  return true;
}
