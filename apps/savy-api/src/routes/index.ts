import health from "./health";
import deviceLogin from "./device/device-login";
import getFleetUsersById from "./fleet/get-fleet-users-by-fleet-id";
import getFleetUsersByName from "./fleet/get-fleet-users-by-fleet-name";

export default [health, deviceLogin, getFleetUsersById, getFleetUsersByName];
