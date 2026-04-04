import { REST, Routes } from "discord.js";
import Logger from "logger";
import config from "../config";
import { commandData } from "./commands";
import { CommandDeploymentError } from "../error/errors";

const logger = Logger.createWrapper("DeployCommands");
const rest = new REST().setToken(config.token);

function deployToGuild(guildId: string) {
  const deployPromise = rest
    .put(Routes.applicationGuildCommands(config.clientId, guildId), {
      body: commandData.map((cmd) => cmd.toJSON()),
    })
    .then(() => {
      logger.log(`Commands deployed successfully to guild ${guildId}.`);
    })
    .catch((error) => {
      logger.error(`Failed to deploy commands to guild ${guildId}.`, error);
    });

  return deployPromise;
}

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

  const guilds = await rest
    .get(Routes.userGuilds())
    .then((guildIds: unknown) => {
      logger.log("Successfully fetched guilds for command deployment.");

      if (
        !Array.isArray(guildIds) ||
        !guildIds.every((guild) => guild && typeof guild.id === "string")
      ) {
        throw new CommandDeploymentError("InvalidGuildData", null);
      }

      return guildIds.map((guild) => guild.id);
    })
    .catch((error) => {
      logger.error("Failed to fetch guilds for command deployment.", error);
      throw new CommandDeploymentError("FetchGuilds", error);
    });

  const deployPromises = guilds.map((guildId) => deployToGuild(guildId));

  await Promise.all(deployPromises);

  logger.log("Successfully deployed commands to all guilds.");
}
