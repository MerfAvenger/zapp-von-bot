import {
  ChatInputCommandInteraction,
  Client,
  Events,
  GatewayIntentBits,
  MessageFlags,
  Partials,
} from "discord.js";
import Logger from "logger";
import config from "./config";
import deployCommands from "./command/deploy";
import commands, { commandData } from "./command/commands";
import { buildErrorEmbed, isApplicationError } from "./error/errors";

const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [
    Partials.Channel, // Without this, DM channels aren't cached and messages are dropped
    Partials.Message, // Recommended too — ensures DM messages aren't treated as partial/empty
  ],
});

client.once(Events.ClientReady, () => {
  Logger.log("OnClientReady", `Logged in as ${client.user?.tag}!`);
  deployCommands()
    .then(() => {
      Logger.log("OnDeployCommands", "Commands deployed successfully.");
    })
    .catch((error) => {
      Logger.error("OnDeployCommandsError", "Failed to deploy commands", error);
    });
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (
    !interaction.isCommand() ||
    !(interaction instanceof ChatInputCommandInteraction)
  )
    return;

  const command = interaction.commandName;
  const isSubcommand = interaction.options.getSubcommand(false) !== null;
  const fullCommand = isSubcommand
    ? `${command} ${interaction.options.getSubcommand(true)}`
    : command;
  Logger.log("OnInteractionCreate", `Received command: ${fullCommand}`);

  try {
    const commandModule = commands.find((cmd) => cmd.data.name === command);
    if (commandModule) {
      await commandModule.handler(interaction);
    } else {
      await interaction.reply({
        content: "Unknown command.",
        ephemeral: true,
      });
    }
  } catch (error) {
    Logger.error("CommandHandler", "Error handling command.", error);
    const embeds = [];
    if (isApplicationError(error) && error.isPublic) {
      embeds.push(buildErrorEmbed(error));
    }

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply({
        content: "An error occurred while executing the command.",
        embeds,
      });
    } else {
      await interaction.reply({
        content: "An error occurred while executing the command.",
        embeds,
        flags: [MessageFlags.Ephemeral],
      });
    }
  }
});

async function cleanup() {
  Logger.log("Cleanup", "Cleaning up resources before shutdown...");
  await client.destroy();
  Logger.log("Cleanup", "Cleanup complete. Exiting.");
}

process.on("SIGTERM", () => {
  Logger.log("SIGTERM", "Shutting down...");
  cleanup().then(() => {
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  Logger.log("SIGINT", "Shutting down...");
  cleanup().then(() => {
    process.exit(0);
  });
});

client.login(config.token).catch((error) => {
  Logger.error("OnClientLoginError", "Failed to login to Discord", error);
  process.exit(1);
});
