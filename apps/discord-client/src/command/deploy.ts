import { REST, Routes, Snowflake } from "discord.js";
import Logger from "logger";
import config from "../config";
import commands from "./commands";
import { CommandDeploymentError } from "../error/errors";

const logger = Logger.createWrapper("DeployCommands");
const rest = new REST().setToken(config.token);

function deployToGuild(guildId: string) {
  const deployPromise = rest
    .put(Routes.applicationGuildCommands(config.clientId, guildId), {
      body: commands.map((cmd) => cmd.data.toJSON()),
    })
    .then(() => {
      logger.log(`Commands deployed successfully to guild ${guildId}.`);
    })
    .catch((error) => {
      logger.error(`Failed to deploy commands to guild ${guildId}.`, error);
    });

  return deployPromise;
}

/**
 * Builds a summary string of all commands and their subcommands for logging purposes.
 *
 * @returns {string} A summary string of all commands and their subcommands.
 */
function buildCommandSummary() {
  return commands
    .map((cmd) => {
      if (cmd.data.options && cmd.data.options.length > 0) {
        const subcommands = cmd.data.options
          .filter((opt: any) => opt.type === 1) // Type 1 is SUB_COMMAND
          .map((opt: any) => opt.name);
        return subcommands.length > 0
          ? `${cmd.data.name} (${subcommands.join(", ")})`
          : cmd.data.name;
      }
      return cmd.data.name;
    })
    .join(", ");
}

/**
 * Map the fetched guild data to an array of guild IDs for command deployment.
 *
 * @param guildIds The raw guild data fetched from the Discord API, expected to be an array of objects with an 'id' property.
 * @returns {Snowflake[]} An array of guild IDs.
 * @throws {CommandDeploymentError} If the guild data is invalid or cannot be mapped to guild IDs.
 */
function parseGuilds(guildIds: unknown): Snowflake[] {
  logger.log("Parsing returned guilds.");

  if (
    !Array.isArray(guildIds) ||
    !guildIds.every((guild) => guild && typeof guild.id === "string")
  ) {
    throw new CommandDeploymentError("InvalidGuildData", null);
  }

  return guildIds.map((guild) => guild.id);
}

/**
 * Deploys commands to multiple guilds in parallel and waits for all deployments to complete.
 *
 * @param guildIds An array of guild IDs to deploy commands to.
 * @returns A promise that resolves when all deployments are complete.
 */
async function deployToGuilds() {
  const guildIds = await rest
    .get(Routes.userGuilds())
    .then(parseGuilds)
    .catch((error) => {
      logger.error("Failed to fetch guilds for command deployment.", error);
      throw new CommandDeploymentError("FetchGuilds", error);
    });

  const deployPromises = guildIds.map((guildId) => deployToGuild(guildId));
  return Promise.all(deployPromises);
}

/**
 * Clears all global commands for the application.
 *
 * @returns {Promise<void>} A promise that resolves when all global commands are cleared.
 */
export async function clearCommands() {
  return await rest
    .put(Routes.applicationCommands(config.clientId), { body: [] })
    .then(() => {
      logger.log("Successfully cleared global commands.");
    })
    .catch((error) => {
      logger.error("Failed to clear global commands.", error);
      throw new CommandDeploymentError("ClearGlobalCommands", error);
    });
}

export default async function deployCommands() {
  logger.log("Deploying commands:", buildCommandSummary());

  // Clear global commands before deploying to guilds to ensure a clean slate.
  await clearCommands();
  await deployToGuilds();

  logger.log("Successfully deployed commands to all guilds.");
}
