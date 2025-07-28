import TournamentController from "../../controllers/TournamentController";
import { Method, Route } from "../../types";

const method: Method = "GET";
const path = "/api/tournament/fleet-data-list";
const handler = TournamentController.getFleetTournamentDataList;

const route: Route = { method, path, handler };
export default route;
