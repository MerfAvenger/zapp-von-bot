import health from "./health";
import getFleetUsersById from "./fleet/get-fleet-users-by-fleet-id";
import getFleetUsersByName from "./fleet/get-fleet-users-by-fleet-name";
import getFilteredFleetUsers from "./fleet/get-filtered-fleet-users";
import getTournanamentFleets from "./tournament/get-tournament-fleets";
import getFleetTournamentDataList from "./tournament/get-tournament-fleet-data-list";
import getUserByName from "./user/get-user-by-name";
import getUserById from "./user/get-user-by-id";
import isTournamentActive from "./tournament/is-tournament-active";

export default [
  health,
  getFleetUsersById,
  getFleetUsersByName,
  getFilteredFleetUsers,
  getTournanamentFleets,
  isTournamentActive,
  getFleetTournamentDataList,
  getUserByName,
  getUserById,
];
