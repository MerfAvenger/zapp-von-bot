import {
  ChatInputCommandInteraction,
  Client,
  Events,
  GatewayIntentBits,
} from "discord.js";
import Logger from "logger";
import config from "./config";
import userCommand from "./command/commands/users/users";
import deployCommands from "./command/deploy";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
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
  Logger.log("OnInteractionCreate", `Received command: ${command}`);

  switch (command) {
    case "users":
      await userCommand.handler(interaction);
      break;
    default:
      await interaction.reply({
        content: "Unknown command.",
        ephemeral: true,
      });
      break;
  }
});

client.login(config.token).catch((error) => {
  Logger.error("OnClientLoginError", "Failed to login to Discord", error);
  process.exit(1);
});
