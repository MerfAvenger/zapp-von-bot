import Logger from "../logger/Logger";
import pool from "../database/pool";
import { makeQuery } from "../database/query";
import DeviceService from "./DeviceService";
import { Fleet, User } from "../../../../packages/model/types";
import { buildSavyUrl, SAVY_API_ENDPOINTS } from "../utils/savy/endpoints";
import Extractor from "../xml/Extractor";
import { inspect } from "node:util";
import { skip } from "node:test";
import {
  FleetNotFoundError,
  NoFleetUsersError,
  TooManyFleetsError,
} from "../errors/SavyAPIError";
import {
  extractFleetsFromSearchAlliances,
  extractUsersFromListUsers,
} from "../xml/extractors";

const logger = Logger.createWrapper("FleetService");

export default class FleetService {
  static async searchFleets(
    fleetName: string,
    maxResults = 5,
    offset = 0
  ): Promise<Fleet[] | null> {
    logger.log("Searching fleets with name:", fleetName);
    const fleets = DeviceService.authenticatedFetch<Fleet[]>(
      SAVY_API_ENDPOINTS.fleet.searchFleets,
      { name: fleetName, take: maxResults.toString(), skip: offset.toString() },
      extractFleetsFromSearchAlliances
    );

    if (!fleets) {
      throw new FleetNotFoundError(fleetName);
    }

    logger.log("Fleets found:", { fleets });
    return fleets;
  }

  static async getFleetUsersByFleetId(fleetId: string): Promise<User[]> {
    logger.log("Fetching fleet users by fleet ID:", fleetId);
    return await DeviceService.authenticatedFetch<User[]>(
      SAVY_API_ENDPOINTS.fleet.getListUsers,
      { allianceId: fleetId, skip: "0", take: "100" },
      extractUsersFromListUsers
    );
  }

  static async getFleetByName(fleetName: string): Promise<Fleet> {
    logger.log("Fetching fleet by name:", fleetName);
    const fleets = await this.searchFleets(fleetName);

    if (!fleets || fleets.length === 0) {
      throw new FleetNotFoundError(fleetName);
    }

    if (fleets.length > 1) {
      throw new TooManyFleetsError(fleetName);
    }

    const fleet = fleets[0];

    logger.log("Fleet found:", inspect({ fleet }), inspect({ fleets }));
    return fleet;
  }

  static async getFleetUsersByFleetName(fleetName: string): Promise<User[]> {
    logger.log("Fetching fleet users by fleet name:", fleetName);
    const fleet = await this.getFleetByName(fleetName);

    if (!fleet) {
      throw new FleetNotFoundError(`Fleet with name ${fleetName} not found.`);
    }

    const users = await this.getFleetUsersByFleetId(fleet.id);

    if (!users) {
      throw new NoFleetUsersError(fleetName);
    }

    logger.log(
      "Users found for fleet:",
      inspect({ fleet }),
      inspect({ users })
    );
    return users;
  }
}
