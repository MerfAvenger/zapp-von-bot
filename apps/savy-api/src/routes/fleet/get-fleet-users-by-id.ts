// import UserService from "../../services/UserService";
import FleetController from "../../controllers/FleetController";
import { Method, Route } from "../../types";

const method: Method = "GET";
const path = "/api/get-fleet-users-by-id/:allianceId";
const handler = FleetController.getFleetUsersById;

const route: Route = { method, path, handler };
export default route;
