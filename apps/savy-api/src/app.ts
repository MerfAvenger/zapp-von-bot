import express from "express";
import router from "./router";
import config from "./config";
import Logger from "./logger/Logger";

const logger = Logger.createWrapper("App");

const app = express();
app.use(express.json());
app.use(router);

app.listen(config.port, () => {
  logger.log(`Server is running on port ${config.port}`);
  logger.log("Current working directory: ", __dirname);
});

app.on("error", (err) => {
  logger.error("Server error:", err);
  process.exit(1);
});

app.on("uncaughtException", (err) => {
  logger.error("Uncaught exception:", err);
  process.exit(1);
});

app.on("SIGINT", () => {
  logger.log("[SIGINT] Server shutting down...");
  process.exit(0);
});

app.on("SIGTERM", () => {
  logger.log("[SIGTERM] Server shutting down...");
  process.exit(0);
});
