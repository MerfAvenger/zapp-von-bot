import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import Logger from "logger";
import {
  loadSettingsForServer,
  updateSettingsForServer,
} from "../../../../settings/server";
import { assertHasRequiredPermissions } from "../../../utils";

export const data = new SlashCommandSubcommandBuilder()
  .setName("message-the-admirals")
  .setDescription("Configure settings for the message the admirals command.")
  .addChannelOption((option) =>
    option
      .setName("channel")
      .setDescription("The channel to forward user's messages to leadership.")
      .setRequired(true),
  );

const handler = async (interaction: ChatInputCommandInteraction) => {
  const channelIdInput = interaction.options.getChannel("channel", true);

  Logger.log(
    "MessageTheAdmiralsCommand",
    `User "${interaction.user.username}" configured the inbox channel: ${channelIdInput.name} [${channelIdInput.id}]`,
  );

  updateSettingsForServer(interaction.guildId, {
    messageTheAdmirals: {
      channelId: channelIdInput.id,
    },
  });

  await interaction.editReply({
    content: `The channel for the message the admirals command has been set to <#${channelIdInput.id}>.`,
  });
};

export default {
  data,
  handler,
};
