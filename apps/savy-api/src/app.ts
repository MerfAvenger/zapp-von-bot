import express from "express";
import router from "./router";
import config from "./config";
import Logger from "./logger/Logger";

const SYSTEM_NAME = "App";

const app = express();
app.use(express.json());
app.use(router);

app.listen(config.port, () => {
  Logger.log(SYSTEM_NAME, `Server is running on port ${config.port}`);
  Logger.log(SYSTEM_NAME, "Current working directory: ", __dirname);
});

app.on("error", (err) => {
  Logger.error(SYSTEM_NAME, "Server error:", err);
  process.exit(1);
});

app.on("uncaughtException", (err) => {
  Logger.error(SYSTEM_NAME, "Uncaught exception:", err);
  process.exit(1);
});

app.on("SIGINT", () => {
  Logger.log(SYSTEM_NAME, "[SIGINT] Server shutting down...");
  process.exit(0);
});

app.on("SIGTERM", () => {
  Logger.log(SYSTEM_NAME, "[SIGTERM] Server shutting down...");
  process.exit(0);
});
