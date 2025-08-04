import Logger from "logger";
import { User } from "../../../../packages/model/types";
import { SAVY_API_ENDPOINTS } from "../utils/savy/endpoints";
import DeviceService from "./DeviceService";
import {
  extractUserFromGetUser,
  extractUsersFromSearchUsers,
} from "../xml/extractors";
import { UserNotFoundError } from "../errors/SavyAPIError";
import { inspect } from "util";

const logger = Logger.createWrapper("UserService");

export default class UserService {
  static async getUserById(userId: string): Promise<User> {
    logger.log("Fetching user by ID:", userId);
    const user = await DeviceService.authenticatedFetch<User>(
      SAVY_API_ENDPOINTS.user.getUserById,
      { userId },
      extractUserFromGetUser
    );

    if (!user) {
      throw new UserNotFoundError(userId);
    }

    const mappedUser = {
      ...user,
      rank: user.rank.match(/[A-Z][a-z]+/g).join(" "),
    };

    logger.log("User found:", inspect({ user: mappedUser }));
    return mappedUser;
  }

  static async searchUsers(userName: string): Promise<User[] | null> {
    logger.log("Searching users with name:", userName);
    const users = await DeviceService.authenticatedFetch<User[]>(
      SAVY_API_ENDPOINTS.user.searchUsers,
      { searchString: userName },
      extractUsersFromSearchUsers
    );

    if (!users || users.length === 0) {
      logger.warn("No users found with name:", userName);
      return null;
    }

    const mappedUsers = users.map((user) => ({
      ...user,
      rank: user.rank.match(/[A-Z][a-z]+/g).join(" "),
    }));

    logger.log("Users found:", { mappedUsers });
    return mappedUsers;
  }

  static async getUserByName(userName: string): Promise<User | null> {
    logger.log("Fetching user by name:", userName);
    const users = await this.searchUsers(userName);

    if (!users || users.length === 0) {
      logger.warn("No user found with name:", userName);
      return null;
    }

    if (users.length > 1) {
      logger.warn("Multiple users found with name:", userName);
      throw new UserNotFoundError(userName);
    }

    logger.log("User found:", inspect({ user: users[0] }));
    return users[0];
  }
}
