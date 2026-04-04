import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import Logger from "logger";
import { clearCommands } from "../../../clean";
import deployCommands from "../../../deploy";

export const data = new SlashCommandSubcommandBuilder()
  .setName("redeploy-commands")
  .setDescription("Nuke the bot commands and redeploy them afresh.");

const handler = async (interaction: ChatInputCommandInteraction) => {
  await clearCommands();
  await deployCommands();

  Logger.log(
    "RedeployCommands",
    `User "${interaction.user.username}" redeployed the bot commands.`,
  );
  await interaction.editReply({
    content:
      "The bot commands have been redeployed. This may take a moment whilst they redeploy.",
  });
};

export default {
  data,
  handler,
};
