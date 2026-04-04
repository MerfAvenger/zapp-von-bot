import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import Logger from "logger";
import {
  loadSettingsForServer,
  ServerSettings,
} from "../../../../settings/server";
import { assertHasRequiredPermissions } from "../../../utils";

export const data = new SlashCommandSubcommandBuilder()
  .setName("view")
  .setDescription("View the current bot settings.");

const buildSettingsMessage = (settings: ServerSettings) => {
  return `**Admin Role:** ${
    settings.permissions.configureSettings
      ? `<@&${settings.permissions.configureSettings}>`
      : "Not set"
  }
**Message The Admirals Inbox:** ${
    settings.messageTheAdmirals.channelId
      ? `<#${settings.messageTheAdmirals.channelId}>`
      : "Not set"
  }`;
};

const handler = async (interaction: ChatInputCommandInteraction) => {
  const settings = loadSettingsForServer(interaction.guildId);
  assertHasRequiredPermissions(interaction.guild, interaction.user, [
    settings.permissions.configureSettings,
  ]);

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
