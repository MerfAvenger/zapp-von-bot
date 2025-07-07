import Logger from "../logger/Logger";
import pool from "../database/pool";
import { makeQuery } from "../database/query";
import DeviceService from "./DeviceService";
import { User } from "../../../../packages/model/types";
import { buildSavyUrl, SAVY_API_ENDPOINTS } from "../utils/savy/endpoints";
import Extractor from "../xml/Extractor";

const logger = Logger.createWrapper("FleetService");

export default class FleetService {
  static async getFleetByName(fleetName: string) {}

  static async getFleetUsers(allianceId: string): Promise<User[] | null> {
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
      allianceId,
      accessToken,
      skip: "0",
      take: "100",
    });

    logger.log("Fetching fleet users from URL:", url);

    const response = await fetch(url, {
      method: "GET",
    })
      .then((res) => {
        if (!res.ok) {
          logger.error("Failed to fetch fleet users:", res.statusText);
          return null;
        }
        return res.text();
      })
      .catch((err) => {
        logger.error("Error fetching fleet users:", err);
        return null;
      });

    if (!response) {
      logger.error("No response received from fleet users endpoint.");
      return null;
    }

    const users = new Extractor(response, ["ListUsers"]).extract<User[]>(
      ["AllianceService", "ListUsers", "Users", "User"],
      {
        id: "Id",
        name: "Name",
        trophy: "Trophy",
      }
    );

    return users;
  }
}
