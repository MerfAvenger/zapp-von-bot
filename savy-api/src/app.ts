import express from "express";
import router from "./router";
import config from "./config";

const app = express();
app.use(express.json());
app.use(router);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
  console.log("Current working directory: ", __dirname);
});

app.on("error", (err) => {
  console.error("Server error:", err);
  process.exit(1);
});

app.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  process.exit(1);
});

app.on("SIGINT", () => {
  console.log("Server shutting down...");
  process.exit(0);
});
