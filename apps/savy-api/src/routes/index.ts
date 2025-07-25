import health from "./health";
import getFleetUsersById from "./fleet/get-fleet-users-by-fleet-id";
import getFleetUsersByName from "./fleet/get-fleet-users-by-fleet-name";
import getFilteredFleetUsers from "./fleet/get-filtered-fleet-users";

export default [
  health,
  getFleetUsersById,
  getFleetUsersByName,
  getFilteredFleetUsers,
];
