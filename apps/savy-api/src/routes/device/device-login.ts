// import UserService from "../../services/UserService";
import DeviceController from "../../controllers/DeviceController";
import { Method, Route } from "../../types";

const method: Method = "GET";
const path = "/api/device-login";
const handler = DeviceController.deviceLogin;

const route: Route = { method, path, handler };
export default route;
