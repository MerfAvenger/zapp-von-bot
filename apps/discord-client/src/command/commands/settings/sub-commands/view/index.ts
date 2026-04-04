import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import Logger from "logger";
import { loadSettingsForServer } from "../../../../../settings/server";
import { buildSettingsMessage } from "./settingsDisplay";

export const data = new SlashCommandSubcommandBuilder()
  .setName("view")
  .setDescription("View the current bot settings.");

const handler = async (interaction: ChatInputCommandInteraction) => {
  const settings = loadSettingsForServer(interaction.guildId);

  Logger.log(
    "ViewSettings",
    `User "${interaction.user.username}" viewed the bot settings.`,
  );
  await interaction.editReply({
    content: buildSettingsMessage(settings),
  });
};

export default {
  data,
  handler,
};
