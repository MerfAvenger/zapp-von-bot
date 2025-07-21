// import UserService from "../../services/UserService";
import FleetController from "../../controllers/FleetController";
import { Method, Route } from "../../types";

const method: Method = "GET";
const path = "/api/fleet/users/by-name/:fleetName";
const handler = FleetController.getFleetUsersByFleetName;

const route: Route = { method, path, handler };
export default route;
