import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import Logger from "logger";
import { createSettings } from "../../../../settings/settings";

export const data = new SlashCommandSubcommandBuilder()
  .setName("reset")
  .setDescription("Reset the bot settings to their default values.");

const handler = async (interaction: ChatInputCommandInteraction) => {
  Logger.log(
    "ResetSettings",
    `User "${interaction.user.username}" reset the bot settings.`,
  );

  createSettings();

  await interaction.editReply({
    content: "The bot settings have been reset to their default values.",
  });
};

export default {
  data,
  handler,
};
