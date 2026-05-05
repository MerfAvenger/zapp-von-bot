import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import Logger from "logger";
import { updateSettingsForServer } from "../../../../settings/server";
import { GuildOnlyCommandError } from "../../../../error/errors";

export const data = new SlashCommandSubcommandBuilder()
  .setName("inbox")
  .setDescription(
    "Configure the inbox channel for the message the admirals command.",
  )
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to forward user's messages to.")
      .setRequired(true),
  );

const handler = async (interaction: ChatInputCommandInteraction) => {
  if (!interaction.guildId) {
    throw new GuildOnlyCommandError(interaction.user, "settings-inbox");
  }

  const channelIdInput = interaction.options.getChannel("channel", true);

  updateSettingsForServer(interaction.guildId, {
    messageTheAdmirals: {
      channelId: channelIdInput.id,
    },
  });

  Logger.log(
    "SettingsInboxCommand",
    `User "${interaction.user.username}" configured the inbox channel: ${channelIdInput.name} [${channelIdInput.id}]`,
  );
  await interaction.editReply({
    content: `The channel for the message the admirals command has been set to <#${channelIdInput.id}>.`,
  });
};

export default {
  data,
  handler,
};
