import { REST, Routes } from "discord.js";
import userCommands from "./commands/users/users";
import Logger from "logger";
import config from "../config";

const commands = [userCommands.data];

const logger = Logger.createWrapper("DeployCommands");
const rest = new REST().setToken(config.token);

export default async function deployCommands() {
  logger.log(
    "Deploying commands...",
    commands.map((cmd) => cmd.toJSON())
  );

  await rest.put(Routes.applicationCommands(config.clientId), {
    body: commands,
  });
}
