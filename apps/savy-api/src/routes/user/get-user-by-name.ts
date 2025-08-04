import UserController from "../../controllers/UserController";
import { Method, Route } from "../../types";

const method: Method = "GET";
const path = "/api/user/by-name/:userName";
const handler = UserController.getUserByName;

const route: Route = { method, path, handler };
export default route;
