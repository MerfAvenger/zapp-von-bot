import { Handler } from "express";
import Logger from "../logger/Logger";
import FleetService from "../services/FleetService";
import { SavyAPIError } from "../errors/SavyAPIError";

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
}
