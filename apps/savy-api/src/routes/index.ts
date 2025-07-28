import health from "./health";
import getFleetUsersById from "./fleet/get-fleet-users-by-fleet-id";
import getFleetUsersByName from "./fleet/get-fleet-users-by-fleet-name";
import getFilteredFleetUsers from "./fleet/get-filtered-fleet-users";
import getTournanamentFleets from "./tournament/get-tournament-fleets";
import getFleetTournamentDataList from "./tournament/get-tournament-fleet-data-list";

export default [
  health,
  getFleetUsersById,
  getFleetUsersByName,
  getFilteredFleetUsers,
  getTournanamentFleets,
  getFleetTournamentDataList,
];
