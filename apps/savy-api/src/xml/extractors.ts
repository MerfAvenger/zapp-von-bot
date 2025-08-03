import {
  DeviceAuthentication,
  DeviceData,
  Fleet,
  FleetTournamentData,
  User,
} from "../../../../packages/model/types";
import { DeviceAuthenticationError } from "../errors/SavyAPIError";
import Logger from "../logger/Logger";
import {
  mapFleetDate as mapFleetTournamentDataDate,
  mapFleetDivision,
} from "../utils/map/fleet";
import { isValidDeviceAuthentication } from "../utils/validation/device";
import Extractor from "./Extractor";

export function extractDeviceAuthentication(
  response: string
): DeviceAuthentication {
  const deviceData = new Extractor(response, ["UserLogin"]).extract<DeviceData>(
    ["UserService", "UserLogin"],
    {
      accessToken: "accessToken",
      lastLogin: "PreviousLastLoginDate",
    }
  )[0];

  if (!isValidDeviceAuthentication(deviceData)) {
    throw new DeviceAuthenticationError(
      "Failed to extract device data from response."
    );
  }

  return deviceData;
}

export function extractFleetsFromSearchAlliances(response: string): Fleet[] {
  Logger.log("ExtractFleetsFromSearch", "Extracting fleets from response.");

  const fields: Record<keyof Fleet, string> = {
    id: "AllianceId",
    name: "AllianceName",
    trophies: "Trophy",
    division: "DivisionDesignId",
    numberOfUsers: "NumberOfMembers",
  };

  return new Extractor(response, ["SearchAlliances"])
    .extract<Fleet>(
      ["AllianceService", "SearchAlliances", "Alliances", "Alliance"],
      fields
    )
    .map((fleet) => mapFleetDivision(fleet) as Fleet);
}

export function extractTournamentFleets(response: string): Fleet[] {
  Logger.log(
    "ExtractTournamentFleets",
    "Extracting tournament fleets from response."
  );

  const fields: Record<keyof Fleet, string> = {
    id: "AllianceId",
    name: "AllianceNameName",
    trophies: "Trophy",
    division: "DivisionDesignId",
    numberOfUsers: "NumberOfMembers",
  };

  return new Extractor(response, ["ListAlliancesWithDivision"]).extract<Fleet>(
    ["AllianceService", "ListAlliancesWithDivision", "Alliances", "Alliance"],
    fields
  );
}

export function extractTournamentFleetDataList(
  response: string
): FleetTournamentData[] {
  Logger.log(
    "ExtractTournamentFleetDataList",
    "Extracting tournament fleet data from response."
  );

  const fields: Record<keyof FleetTournamentData, string> = {
    id: "AllianceId",
    name: "AllianceName",
    trophies: "Trophy",
    stars: "Score",
    number_of_users: "NumberOfMembers",
    division: "DivisionDesignId",
    // These fields are not present in the response, but are included for completeness to get other type protections
    hour: "Hour",
    day: "Day",
    month: "Month",
    year: "Year",
  };

  const rawData = new Extractor(response, [
    "ListAlliancesWithDivision",
  ]).extract<FleetTournamentData>(
    ["AllianceService", "ListAlliancesWithDivision", "Alliances", "Alliance"],
    fields
  );

  return rawData.map(
    (data) =>
      mapFleetTournamentDataDate(mapFleetDivision(data)) as FleetTournamentData
  );
}

export function extractUsersFromListUsers(response: string): User[] {
  Logger.log("ExtractUsersFromListUsers", "Extracting users from response.");

  const fields: Record<keyof User, string> = {
    id: "Id",
    name: "Name",
    trophy: "Trophy",
    lastLogin: "LastLoginDate",
    attacks: "TournamentBonusScore",
    stars: "AllianceScore",
  };

  return new Extractor(response, ["ListUsers"]).extract<User>(
    ["AllianceService", "ListUsers", "Users", "User"],
    fields
  );
}
