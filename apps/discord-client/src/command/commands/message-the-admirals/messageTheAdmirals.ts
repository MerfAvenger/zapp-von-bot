import {
  ChatInputCommandInteraction,
  DMChannel,
  EmbedBuilder,
  Message,
  MessageCreateOptions,
  MessageFlags,
  SlashCommandBuilder,
  Snowflake,
  TextChannel,
  User,
} from "discord.js";
import Logger from "logger";
import { MissingConfigurationError } from "../../../error/errors";
import { loadSettingsForServer } from "../../../settings/server";
import {
  createDirectMessageChannel,
  sendDirectMessage,
} from "../../../message/utils";

const data = new SlashCommandBuilder()
  .setName("message-the-admirals")
  .setDescription("Privately send a message to the leadership team.");

const handler = async (interaction: ChatInputCommandInteraction) => {
  const forwardChannelId = getForwardChannelId(interaction.guildId);

  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  Logger.log(
    "MessageTheAdmiralsCommand",
    "Received command to message the admirals.",
  );

  const channel = await createDirectMessageChannel(interaction);

  const instructionsMessage = buildInstructionsMessage(interaction.user);
  await sendDirectMessage(channel, instructionsMessage).then(async () => {
    await interaction.editReply({
      content:
        "Reply to the message in your DMs to send a message to the admirals.",
    });
  });
  const userResponse = await collectUserMessage(channel, interaction);

  if (userResponse) {
    await forwardResponseToChannel(interaction, userResponse, forwardChannelId);
  }
};

function getForwardChannelId(guildId: Snowflake): string {
  const { channelId } = loadSettingsForServer(guildId).messageTheAdmirals;

  if (!channelId) {
    Logger.error(
      "MessageTheAdmiralsCommand",
      "Leadership inbox channel ID is not configured.",
    );
    throw new MissingConfigurationError("Message the admirals channel ID");
  }

  return channelId;
}

/**
 * Send the user's response to the private message-the-admirals channel.
 *
 * @param originalInteraction The command the user sent originally.
 * @param responseMessage  The DM the bot sent to the user as a reply.
 * @param forwardChannelId The channel ID of the forwarding destination.
 * @returns
 */
async function forwardResponseToChannel(
  originalInteraction: ChatInputCommandInteraction,
  responseMessage: Message,
  forwardChannelId: string,
) {
  const leadershipInboxChannel = originalInteraction.client.channels.cache.get(
    forwardChannelId,
  ) as TextChannel;

  if (!leadershipInboxChannel || !leadershipInboxChannel.isTextBased()) {
    Logger.error(
      "MessageTheAdmiralsCommand",
      `Leadership inbox channel with ID ${forwardChannelId} not found or is not text-based.`,
    );
    return;
  }

  const responseEmbed = new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle("New message for the admirals!")
    .setDescription(responseMessage.content)
    .setAuthor({
      name: originalInteraction.user.tag,
      iconURL: originalInteraction.user.displayAvatarURL(),
    })
    .setTimestamp(new Date());

  await leadershipInboxChannel.send({ embeds: [responseEmbed] });
}

async function collectUserMessage(
  directMessage: DMChannel,
  interaction: ChatInputCommandInteraction,
): Promise<Message> {
  const filter = (msg) => msg.author.id === interaction.user.id;

  let collected;
  try {
    collected = await directMessage.awaitMessages({
      filter,
      max: 1, // Stop after 1 message
      time: 5 * 60 * 1000, // 5 minute window
      errors: ["time"], // Throw on timeout
    });
  } catch {
    await directMessage.send(
      "The command timed out. Please use the command again if you still want to send a message.",
    );
    return;
  }

  return collected.first();
}

function buildInstructionsMessage(user: User): MessageCreateOptions {
  const message = `
    Hello @${user.tag}! 
      
    Please send me a message with your question or feedback for the leadership team. They will get back to you as soon as possible.
  `;
  return {
    content: message,
  };
}

export default {
  data,
  handler,
};
