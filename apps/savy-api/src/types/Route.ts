import { Handler } from "express";
import Method from "./Method";

/**
 * Route interface, for enforcing route structure.
 *
 * @field method - HTTP method of the route.
 * @field path - Path the route responds to.
 * @field handler - Handler function for the request.
 */
interface Route {
  method: Method;
  path: string;
  handler: Handler;
}

export default Route;
