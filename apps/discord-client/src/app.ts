import { Client, Events, GatewayIntentBits } from "discord.js";
import Logger from "logger";
import config from "./config";

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
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = interaction.commandName;
  Logger.log("OnInteractionCreate", `Received command: ${command}`);

  // Handle commands here
  if (command === "ping") {
    await interaction.reply("Pong!");
  } else {
    await interaction.reply(`Unknown command: ${command}`);
  }
});

client.login(config.token).catch((error) => {
  Logger.error("OnClientLoginError", "Failed to login to Discord", error);
  process.exit(1);
});
