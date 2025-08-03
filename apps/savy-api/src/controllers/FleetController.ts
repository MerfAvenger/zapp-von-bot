import { Handler } from "express";
import Logger from "logger";
import FleetService from "../services/FleetService";
import { SavyAPIError } from "../errors/SavyAPIError";
import FilterExecutor from "../utils/filters/FilterExecutor";

const logger = Logger.createWrapper("FleetController");

export default class FleetController {
  static getFleetUsersByFleetId: Handler = (req, res, _next) => {
    logger.log("Get fleet users request received.", req.params);

    const fleetId = req.params.fleetId as string;

    FleetService.getFleetUsersByFleetId(fleetId)
      .then((users) => {
        logger.log("Fleet user list request successful.", users);
        res.status(200).json(users);
      })
      .catch((error) => {
        if (error instanceof SavyAPIError) {
          logger.error(
            "Failed to fetch fleet users for fleet ID:",
            fleetId,
            error
          );
          return res.status(error.code).json({ error: error.reason });
        }

        return res
          .status(500)
          .json({ error: "Internal server error fetching fleet users." });
      });
  };

  static getFleetUsersByFleetName: Handler = (req, res, _next) => {
    logger.log("Get fleet users by name request received.", req.params);

    const fleetName = req.params.fleetName as string;

    FleetService.getFleetUsersByFleetName(fleetName)
      .then((users) => {
        logger.log("Fleet user list request successful.", users);
        res.status(200).json(users);
      })
      .catch((error) => {
        if (error instanceof SavyAPIError) {
          logger.error(
            "Failed to fetch fleet users for fleet:",
            fleetName,
            error
          );
          return res.status(error.code).json({ error: error.reason });
        }

        return res
          .status(500)
          .json({ error: "Internal server error fetching fleet users." });
      });
  };

  static getFilteredFleetUsers: Handler = (req, res, _next) => {
    logger.log("Get filtered fleet users request received.", req.body);

    const { fleetName, filter } = req.body;

    FleetService.getFleetUsersByFleetName(fleetName)
      .then((users) => {
        const filteredUsers = FilterExecutor.executeFilter(filter, users);

        logger.log("Filtered fleet users request successful.", filteredUsers);
        res.status(200).json(filteredUsers);
      })
      .catch((error) => {
        if (error instanceof SavyAPIError) {
          logger.error(
            "Failed to fetch filtered fleet users for fleet:",
            fleetName,
            error
          );
          return res.status(error.code).json({ error: error.reason });
        }

        return res.status(500).json({
          error: "Internal server error fetching filtered fleet users.",
        });
      });
  };
}
