import { REST, Routes } from "discord.js";
import Logger from "logger";
import config from "../config";
import { commandData } from "./commands";

const logger = Logger.createWrapper("DeployCommands");
const rest = new REST().setToken(config.token);

export default async function deployCommands() {
  logger.log(
    "Deploying commands...",
    commandData.map((cmd) => cmd.toJSON()),
  );

  await rest.put(Routes.applicationCommands(config.clientId), {
    body: commandData.map((cmd) => cmd.toJSON()),
  });
}
