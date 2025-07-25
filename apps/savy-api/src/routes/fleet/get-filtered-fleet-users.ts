import FleetController from "../../controllers/FleetController";
import { Method, Route } from "../../types";

const method: Method = "POST";
const path = "/api/fleet/users/filtered";
const handler = FleetController.getFilteredFleetUsers;

const route: Route = { method, path, handler };
export default route;
