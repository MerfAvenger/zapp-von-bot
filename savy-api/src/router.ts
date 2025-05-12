import { Router } from "express";

import Routes from "./routes";

const router = Router();

// Iterate through exported routes and register them with the router
Routes.forEach((route) => {
  const { method, path, handler } = route;

  console.log(`Registering route: ${method} ${path}`);
  router[method.toLowerCase()](path, handler);
});

export default router;
