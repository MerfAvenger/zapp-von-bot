import {
  Fleet,
  FleetTournamentData,
} from "../../../../../packages/model/types";

export function mapFleetDivision(
  fleet: Fleet | FleetTournamentData
): Fleet | FleetTournamentData {
  switch (fleet.division) {
    case "1":
      fleet.division = "A";
      break;
    case "2":
      fleet.division = "B";
      break;
    case "3":
      fleet.division = "C";
      break;
    case "4":
      fleet.division = "D";
      break;
    default:
      fleet.division = "No Division";
  }

  return fleet;
}

export function mapFleetDate(
  fleet: Fleet | FleetTournamentData
): Fleet | FleetTournamentData {
  const year = new Date().getUTCFullYear();
  const month = new Date().getUTCMonth() + 1;
  const daysInMonth = new Date(year, month, 0).getDate();
  const day = new Date().getUTCDate() - (daysInMonth - 7); // Adjusting to get the last 7 days
  const hour = new Date().getUTCHours();

  return {
    ...fleet,
    year,
    month,
    day,
    hour,
  };
}
