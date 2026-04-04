import { REST, Routes } from "discord.js";
import config from "../config";
import Logger from "logger";
import { CommandDeploymentError } from "../error/errors";

export async function clearCommands() {
  const rest = new REST().setToken(config.token);

  return await rest
    .put(Routes.applicationCommands(config.clientId), { body: [] })
    .then(() => {
      Logger.log("ClearCommands", "Successfully cleared global commands.");
    })
    .catch((error) => {
      throw new CommandDeploymentError("ClearGlobalCommands", error);
    });
}
