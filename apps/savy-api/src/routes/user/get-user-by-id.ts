import UserController from "../../controllers/UserController";
import { Method, Route } from "../../types";

const method: Method = "GET";
const path = "/api/user/by-id/:userId";
const handler = UserController.getUserById;

const route: Route = { method, path, handler };
export default route;
