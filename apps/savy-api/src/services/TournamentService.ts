import { Fleet, FleetTournamentData } from "../../../../packages/model/types";
import {
  InvalidDivisionError,
  NotInTournamentError,
} from "../errors/SavyAPIError";
import Logger from "logger";
import { SAVY_API_ENDPOINTS } from "../utils/savy/endpoints";
import {
  extractTournamentFleetDataList,
  extractTournamentFleets,
} from "../xml/extractors";
import DeviceService from "./DeviceService";

const logger = Logger.createWrapper("TournamentService");

export type TournamentDivision = "A" | "B" | "C" | "D" | "E";

export default class TournamentService {
  /**
   * Fetches tournament fleets for a specific division.
   *
   * NOTE: This method **Cannot** use the `assertIsInTournament` method since it is used to check the Savy API for an empty list of tournament fleets if there is no tournament active.
   *
   * @param division A division to search for fleets in.
   * @returns A list of fleets in the specified division.
   * @throws InvalidDivisionError if the division is invalid.
   */
  static async getTournamentDivisionFleets(
    division: TournamentDivision
  ): Promise<Fleet[]> {
    logger.log(`Fetching tournament fleets for division: ${division}`);

    let divisionId = "";

    switch (division) {
      case "A":
        divisionId = "1";
        break;
      case "B":
        divisionId = "2";
        break;
      case "C":
        divisionId = "3";
        break;
      case "D":
        divisionId = "4";
        break;
      case "E":
        divisionId = "5";
        break;
      default:
        logger.warn("Invalid division provided:", division);
        throw new InvalidDivisionError(divisionId);
    }

    const fleets = await DeviceService.authenticatedFetch<Fleet[]>(
      SAVY_API_ENDPOINTS.fleet.getTournamentDivisionFleets,
      { divisionDesignId: divisionId },
      extractTournamentFleets
    );

    return fleets;
  }

  /**
   * Checks if there is currently a tournament by checking if there are any fleets returned in a particular division.
   *
   * @returns A boolean indicating if there is currently a tournament.
   */
  static async isTournamentActive(): Promise<boolean> {
    logger.log("Checking if tournament is active.");

    const fleets = await this.getTournamentDivisionFleets("A");
    return fleets?.length > 0;
  }

  /**
   * Asserts that a tournament is currently active.
   *
   * @throws NotInTournamentError if the user is not in a tournament.
   */
  private static async assertIsInTournament(): Promise<void> {
    const isInTournament = await this.isTournamentActive();
    if (!isInTournament) {
      throw new NotInTournamentError();
    }
  }

  /**
   * Fetches tournament fleets from the Savy API in an application friendly format.
   *
   * @returns A list of tournament fleets.
   * @throws NotInTournamentError if the user is not in a tournament.
   */
  static async getTournamentFleets(): Promise<Fleet[]> {
    logger.log("Fetching tournament fleets.");

    await this.assertIsInTournament();

    const fleets = await DeviceService.authenticatedFetch<Fleet[]>(
      SAVY_API_ENDPOINTS.fleet.getTournamentFleets,
      {},
      extractTournamentFleets
    );

    logger.log("Tournament fleets found:", { fleets });
    return fleets;
  }

  /**
   * Fetches a list of tournament fleet data objects for use in archiving fleet performance.
   *
   * @returns A list of tournament fleet data objects.
   * @throws NotInTournamentError if the user is not in a tournament.
   */
  static async getFleetTournamentDataList(): Promise<FleetTournamentData[]> {
    logger.log("Fetching tournament data list.");

    await this.assertIsInTournament();

    const tournamentData = await DeviceService.authenticatedFetch<
      FleetTournamentData[]
    >(
      SAVY_API_ENDPOINTS.fleet.getTournamentFleets,
      {},
      extractTournamentFleetDataList
    );

    logger.log("Tournament data list retrieved successfully:", tournamentData);
    return tournamentData;
  }
}
