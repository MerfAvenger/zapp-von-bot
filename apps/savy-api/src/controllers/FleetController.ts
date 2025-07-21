import { Handler } from "express";
import Logger from "../logger/Logger";
import FleetService from "../services/FleetService";

const logger = Logger.createWrapper("FleetController");

export default class FleetController {
  static getFleetUsersByFleetId: Handler = (req, res, _next) => {
    logger.log("Get fleet users request received.", req.params);

    const fleetId = req.params.fleetId as string;

    FleetService.getFleetUsersByFleetId(fleetId)
      .then((users) => {
        if (!users) {
          logger.warn("No users found for the specified fleet ID:", fleetId);
          return res
            .status(404)
            .json({ error: "No users found for this fleet." });
        }

        logger.log("Fleet user list request successful.", users);
        res.status(200).json(users);
      })
      .catch((error) => {
        logger.error(
          "Failed to create or fetch fleet users for fleet:",
          fleetId,
          error
        );
        res
          .status(500)
          .json({ error: "Internal server error fetching fleet users." });
      });
  };

  static getFleetUsersByFleetName: Handler = (req, res, _next) => {
    logger.log("Get fleet users by name request received.", req.params);

    const fleetName = req.params.fleetName as string;

    FleetService.getFleetUsersByFleetName(fleetName)
      .then((users) => {
        if (!users) {
          logger.warn(
            "No users found for the specified fleet name:",
            fleetName
          );
          return res.status(404).json({
            error: "No users found for the specified fleet name.",
          });
        }

        logger.log("Fleet user list request successful.", users);
        res.status(200).json(users);
      })
      .catch((error) => {
        logger.error(
          "Failed to create or fetch fleet users for fleet:",
          fleetName,
          error
        );
        res
          .status(500)
          .json({ error: "Internal server error fetching fleet users." });
      });
  };
}
