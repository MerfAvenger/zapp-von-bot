import Logger from "logger";
import UserService from "../services/UserService";
import { SavyAPIError } from "../errors/SavyAPIError";
import { Handler } from "express";

const logger = Logger.createWrapper("UserController");

export default class UserController {
  static getUserById: Handler = (req, res, _next) => {
    logger.log("Get user by ID request received.", req.params);

    const userId = req.params.userId as string;

    UserService.getUserById(userId)
      .then((user) => {
        logger.log("User found:", user);
        res.status(200).json(user);
      })
      .catch((error) => {
        if (error instanceof SavyAPIError) {
          logger.warn("User not found:", userId, error);
          return res.status(error.code).json({ error: error.reason });
        }

        logger.error("Internal server error fetching user:", error);
        return res
          .status(500)
          .json({ error: "Internal server error fetching user." });
      });
  };

  static getUserByName: Handler = (req, res, _next) => {
    logger.log("Get user by name request received.", req.params);

    const userName = req.params.userName as string;

    UserService.getUserByName(userName)
      .then((user) => {
        logger.log("User found:", user);
        res.status(200).json(user);
      })
      .catch((error) => {
        if (error instanceof SavyAPIError) {
          logger.warn("User not found:", userName, error);
          return res.status(error.code).json({ error: error.reason });
        }

        logger.error("Internal server error fetching user:", error);
        return res
          .status(500)
          .json({ error: "Internal server error fetching user." });
      });
  };
}
