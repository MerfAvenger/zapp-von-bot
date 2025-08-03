import { Account, Device } from "../../../../packages/model/types";
import pool from "../database/pool";
import { makeQuery } from "../database/query";

import Logger from "logger";
import { hasDeviceAuthenticationExpired } from "../utils/savy/device";
import { isValidAccount } from "../utils/validation/account";

const logger = Logger.createWrapper("AccountService");

export default class AccountService {
  static async getAccountByName(accountName: string) {
    const account = await makeQuery<Account>(
      pool,
      "SELECT * FROM accounts WHERE name = ?",
      [accountName],
      isValidAccount
    );

    if (!account) {
      logger.warn("No account found.");
      return null;
    }

    const accountData = account[0];

    logger.log("Account found:", accountData);

    return accountData;
  }

  /**
   *
   *
   * @param accountName
   * @param device
   */
  static async getAuthenticatedAccount(accountName: string, device: Device) {
    const account = await this.getAccountByName(accountName);
    if (!account) {
      logger.error("No account found for authentication.");
      return null;
    }
  }
}
