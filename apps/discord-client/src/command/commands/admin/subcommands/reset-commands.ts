import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import Logger from "logger";

export const data = new SlashCommandSubcommandBuilder()
  .setName("reset-commands")
  .setDescription("Nuke the bot commands and redeploy them afresh.");

const handler = async (interaction: ChatInputCommandInteraction) => {
  Logger.log(
    "ResetCommands",
    `User "${interaction.user.username}" reset the bot commands.`,
  );
  await interaction.editReply({
    content:
      "The bot commands have been reset. This may take a moment whilst they redeploy.",
  });
};

export default {
  data,
  handler,
};
