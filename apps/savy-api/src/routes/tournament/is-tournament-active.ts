import TournamentController from "../../controllers/TournamentController";

import { Method, Route } from "../../types";
const method: Method = "GET";
const path = "/api/tournament/is-tournament-active";
const handler = TournamentController.isTournamentActive;

const route: Route = { method, path, handler };
export default route;
