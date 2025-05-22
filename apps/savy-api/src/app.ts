import express from "express";
import router from "./router";
import config from "./config";

const app = express();
app.use(express.json());
app.use(router);

app.listen(config.port, () => {
  Logger.log(`Server is running on port ${config.port}`);
  Logger.log("Current working directory: ", __dirname);
});

app.on("error", (err) => {
  Logger.error("Server error:", err);
  process.exit(1);
});

app.on("uncaughtException", (err) => {
  Logger.error("Uncaught exception:", err);
  process.exit(1);
});

app.on("SIGINT", () => {
  Logger.log("[SIGINT] Server shutting down...");
  process.exit(0);
});

app.on("SIGTERM", () => {
  Logger.log("[SIGTERM] Server shutting down...");
  process.exit(0);
});
