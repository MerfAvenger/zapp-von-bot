import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import Logger from "logger";
import { resetServerSettings } from "../../../../settings/server";
import { GuildOnlyCommandError } from "../../../../error/errors";

export const data = new SlashCommandSubcommandBuilder()
  .setName("reset")
  .setDescription("Reset the bot settings to their default values.");

const handler = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.guildId) {
    throw new GuildOnlyCommandError(interaction.user, "reset-settings");
  }

  resetServerSettings(interaction.guildId);

  Logger.log(
    "ResetSettings",
    `User "${interaction.user.username}" reset the bot settings.`,
  );
  await interaction.editReply({
    content: "The bot settings have been reset to their default values.",
  });
};

export default {
  data,
  handler,
};
