import { Router } from "express";

import Routes from "./routes";
import Logger from "./logger/Logger";

const router = Router();

// Iterate through exported routes and register them with the router
Routes.forEach((route) => {
  const { method, path, handler } = route;

  Logger.log(`Registering route: ${method} ${path}`);
  router[method.toLowerCase()](path, handler);
});

router.use((req, res, next) => {
  res
    .status(404)
    .json({ error: "Could not find route [" + req.method + "] " + req.path });
});

export default router;
