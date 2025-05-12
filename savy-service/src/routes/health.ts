import type { Route, Method } from "../types";

const method: Method = "GET";
const path = "/api/health";
const handler = async function (_req, res) {
  res.status(200);
  res.json({
    status: "ok",
    message: "Savy Service is running...",
  });
};

const route: Route = { method, path, handler };
export default route;
