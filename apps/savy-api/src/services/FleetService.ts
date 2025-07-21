import Logger from "../logger/Logger";
import pool from "../database/pool";
import { makeQuery } from "../database/query";
import DeviceService from "./DeviceService";
import { Fleet, User } from "../../../../packages/model/types";
import { buildSavyUrl, SAVY_API_ENDPOINTS } from "../utils/savy/endpoints";
import Extractor from "../xml/Extractor";
import { inspect } from "node:util";

const logger = Logger.createWrapper("FleetService");

function extractUsers(response: string): User[] {
  return new Extractor(response, ["ListUsers"]).extract<User>(
    ["AllianceService", "ListUsers", "Users", "User"],
    {
      id: "Id",
      name: "Name",
      trophy: "Trophy",
    }
  );
}

function extractFleets(response: string): Fleet[] {
  return new Extractor(response, ["SearchAlliances"]).extract<Fleet>(
    ["AllianceService", "SearchAlliances", "Alliances", "Alliance"],
    {
      id: "AllianceId",
      name: "AllianceName",
    }
  );
}

export default class FleetService {
  static async searchFleets(
    fleetName: string,
    maxResults = 5,
    offset = 0
  ): Promise<Fleet[] | null> {
    const device = await DeviceService.getActiveDevice();

    if (!device) {
      logger.error("No active device found.");
      return null;
    }

    const accessToken = device.accessToken;

    if (!accessToken) {
      logger.error("Device access token is missing.");
      return null;
    }

    const url = buildSavyUrl(SAVY_API_ENDPOINTS.fleet.searchFleets, {
      name: fleetName,
      accessToken,
      take: maxResults.toString(),
      skip: offset.toString(),
    });

    logger.log("Fetching fleet by name from URL:", url);

    const response = await fetch(url, {
      method: "GET",
    })
      .then(async (res) => {
        if (!res.ok) {
          logger.error("Failed to fetch fleet by name:", res.statusText);
          return null;
        }
        const result = await res.text();
        if (!result) {
          logger.error("No response text received from fleet search endpoint.");
          return null;
        }
        logger.log("Fleet search response received successfully.", result);
        return result;
      })
      .catch((err) => {
        logger.error("Error fetching fleet by name:", err);
        return null;
      });

    if (!response) {
      logger.error("No response received from fleet search endpoint.");
      return null;
    }

    const fleets = extractFleets(response);
    if (!fleets) {
      logger.warn("No fleets found with the specified name.");
      return null;
    }

    logger.log("Fleets found:", fleets);
    return fleets;
  }

  static async getFleetUsersByFleetId(fleetId: string): Promise<User[] | null> {
    const device = await DeviceService.getActiveDevice();

    if (!device) {
      logger.error("No active device found.");
      return null;
    }

    const accessToken = device.accessToken;

    if (!accessToken) {
      logger.error("Device access token is missing.");
      return null;
    }

    const url = buildSavyUrl(SAVY_API_ENDPOINTS.fleet.getListUsers, {
      allianceId: fleetId,
      accessToken,
      skip: "0",
      take: "100",
    });

    logger.log("Fetching fleet users from URL:", url);

    const response = await fetch(url, {
      method: "GET",
    })
      .then(async (res) => {
        if (!res.ok) {
          logger.error("Failed to fetch fleet users:", res.statusText);
          return null;
        }
        return await res.text();
      })
      .catch((err) => {
        logger.error("Error fetching fleet users:", err);
        return null;
      });

    if (!response) {
      logger.error("No response received from fleet users endpoint.");
      return null;
    }

    return extractUsers(response);
  }

  static async getFleetByName(fleetName: string): Promise<Fleet | null> {
    const fleets = await this.searchFleets(fleetName);
    if (!fleets || fleets.length === 0) {
      logger.warn("No fleets found with the specified name.");
      return null;
    }
    if (fleets.length > 1) {
      logger.warn("More than one fleet found matching the search term.");
      return null;
    }

    const fleet = fleets[0];
    logger.log("Fleet found:", inspect({ fleet }), inspect({ fleets }));
    return fleet;
  }

  static async getFleetUsersByFleetName(
    fleetName: string
  ): Promise<User[] | null> {
    const fleet = await this.getFleetByName(fleetName);
    if (!fleet) {
      logger.warn("No fleet found with the specified name.");
      return null;
    }

    const users = await this.getFleetUsersByFleetId(fleet.id);
    if (!users) {
      logger.warn("No users found for the specified fleet.");
      return null;
    }

    logger.log("Users found for fleet:", fleet.name, users);
    return users;
  }
}
