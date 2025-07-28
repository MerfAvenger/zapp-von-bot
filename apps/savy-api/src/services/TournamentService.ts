import { Fleet, FleetTournamentData } from "../../../../packages/model/types";
import { NoTournamentFleetsError } from "../errors/SavyAPIError";
import Logger from "../logger/Logger";
import { SAVY_API_ENDPOINTS } from "../utils/savy/endpoints";
import {
  extractTournamentFleetDataList,
  extractTournamentFleets,
} from "../xml/extractors";
import DeviceService from "./DeviceService";

const logger = Logger.createWrapper("TournamentService");

export default class TournamentService {
  static async getTournamentFleets(): Promise<Fleet[]> {
    logger.log("Fetching tournament fleets.");

    const fleets = await DeviceService.authenticatedFetch<Fleet[]>(
      SAVY_API_ENDPOINTS.fleet.getTournamentFleets,
      {},
      extractTournamentFleets
    );

    if (!fleets || fleets.length === 0) {
      throw new NoTournamentFleetsError();
    }

    logger.log("Tournament fleets found:", { fleets });
    return fleets;
  }

  static async getFleetTournamentDataList(): Promise<FleetTournamentData[]> {
    logger.log("Fetching tournament data list.");

    const tournamentData = await DeviceService.authenticatedFetch<
      FleetTournamentData[]
    >(
      SAVY_API_ENDPOINTS.fleet.getTournamentFleets,
      {},
      extractTournamentFleetDataList
    );

    if (!tournamentData || tournamentData.length === 0) {
      throw new NoTournamentFleetsError();
    }

    logger.log("Tournament data list retrieved successfully:", tournamentData);
    return tournamentData;
  }
}
