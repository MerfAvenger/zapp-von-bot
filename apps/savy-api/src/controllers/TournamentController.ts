import { Handler } from "express";
import Logger from "logger";
import TournamentService from "../services/TournamentService";
import { SavyAPIError } from "../errors/SavyAPIError";

const logger = Logger.createWrapper("TournamentController");

export default class TournamentController {
  static getTournamentFleets: Handler = (req, res, _next) => {
    logger.log("Get tournament fleets request received.");

    TournamentService.getTournamentFleets()
      .then((fleets) => {
        logger.log("Tournament fleets request successful.", fleets);
        res.status(200).json(fleets);
      })
      .catch((error) => {
        if (error instanceof SavyAPIError) {
          logger.error("Failed to fetch tournament fleets:", error);
          return res.status(error.code).json({ error: error.reason });
        }

        return res
          .status(500)
          .json({ error: "Internal server error fetching tournament fleets." });
      });
  };

  static getFleetTournamentDataList: Handler = (req, res, _next) => {
    logger.log("Get fleet tournament data request received.");

    TournamentService.getFleetTournamentDataList()
      .then((tournamentData) => {
        logger.log("Fleet tournament data request successful.", tournamentData);
        res.status(200).json(tournamentData);
      })
      .catch((error) => {
        if (error instanceof SavyAPIError) {
          logger.error("Failed to fetch tournament data list:", error);
          return res.status(error.code).json({ error: error.reason });
        }

        return res
          .status(500)
          .json({ error: "Internal server error fetching tournament data." });
      });
  };
}
