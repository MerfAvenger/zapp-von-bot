import { REST, Routes } from "discord.js";
import Logger from "logger";
import config from "../config";
import { commandData } from "./commands";

const logger = Logger.createWrapper("DeployCommands");
const rest = new REST().setToken(config.token);

export default async function deployCommands() {
  const commands = commandData.map((cmd) => cmd.toJSON());

  // Log command names with their subcommands
  const commandSummary = commands.map((cmd) => {
    if (cmd.options && cmd.options.length > 0) {
      const subcommands = cmd.options
        .filter((opt: any) => opt.type === 1) // Type 1 is SUB_COMMAND
        .map((opt: any) => opt.name);
      return subcommands.length > 0
        ? `${cmd.name} (${subcommands.join(", ")})`
        : cmd.name;
    }
    return cmd.name;
  });

  logger.log("Deploying commands:", commandSummary.join(", "));

  await rest.put(Routes.applicationCommands(config.clientId), {
    body: commands,
  });
}
