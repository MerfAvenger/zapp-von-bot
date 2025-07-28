import TournamentController from "../../controllers/TournamentController";
import { Method, Route } from "../../types";

const method: Method = "GET";
const path = "/api/tournament/fleets";
const handler = TournamentController.getTournamentFleets;

const route: Route = { method, path, handler };
export default route;
