import {
  Fleet,
  FleetTournamentData,
} from "../../../../../packages/model/types";
import Logger from "logger";

const logger = Logger.createWrapper("FleetValidation");

export function isValidFleet(fleet: unknown): fleet is Fleet {
  if (typeof fleet !== "object" || fleet === null) {
    return false;
  }

  const testFleet = fleet as Fleet;

  if (typeof testFleet.id !== "string") {
    logger.warn("Invalid fleet ID:", testFleet.id);
    return false;
  }

  if (typeof testFleet.name !== "string") {
    logger.warn("Invalid fleet name:", testFleet.name);
    return false;
  }

  if (typeof testFleet.trophies !== "number") {
    logger.warn("Invalid trophies count:", testFleet.trophies);
    return false;
  }

  if (typeof testFleet.numberOfUsers !== "number") {
    logger.warn("Invalid number of users:", testFleet.numberOfUsers);
    return false;
  }

  return true;
}

export function isValidFleetTournamentData(
  fleet: unknown
): fleet is FleetTournamentData {
  if (typeof fleet !== "object" || fleet === null) {
    return false;
  }

  const testFleet = fleet as FleetTournamentData;

  if (typeof testFleet.id !== "string") {
    logger.warn("Invalid tournament fleet ID:", testFleet.id);
    return false;
  }

  if (typeof testFleet.name !== "string") {
    logger.warn("Invalid tournament fleet name:", testFleet.name);
    return false;
  }

  if (typeof testFleet.stars !== "string") {
    logger.warn("Invalid tournament stars count:", testFleet.stars);
    return false;
  }

  if (typeof testFleet.trophies !== "number") {
    logger.warn("Invalid tournament trophies count:", testFleet.trophies);
    return false;
  }

  if (typeof testFleet.number_of_users !== "number") {
    logger.warn(
      "Invalid tournament number of users:",
      testFleet.number_of_users
    );
    return false;
  }

  return true;
}
