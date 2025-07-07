import { Handler, Request, Response } from "express";
import DeviceService from "../services/DeviceService";
import Logger from "../logger/Logger";
import FleetService from "../services/FleetService";

const logger = Logger.createWrapper("FleetController");

export default class FleetController {
  static getFleetUsersById: Handler = (req, res, _next) => {
    logger.log("Get fleet users request received.", req);

    const allianceId = req.params.allianceId as string;

    FleetService.getFleetUsers(allianceId)
      .then((users) => {
        if (!users) {
          throw new Error("No users found for the specified fleet.");
        }

        logger.log("Fleet user list request successful.", users);
        res.status(200).json(users);
      })
      .catch((error) => {
        logger.error(
          "Failed to create or fetch fleet users for fleet:",
          allianceId,
          error
        );
        res
          .status(500)
          .json({ error: "Internal server error fetching fleet users." });
      });
  };
}
