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

  await channel.send(
    "Thank you for your message! The leadership team will get back to you as soon as they can.",
  );
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
 * @param userReply  The DM the bot sent to the user as a reply.
 * @param forwardChannelId The channel ID of the forwarding destination.
 * @returns
 */
async function forwardResponseToChannel(
  originalInteraction: ChatInputCommandInteraction,
  userReply: Message,
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
    .setTitle("New Private Message to Leadership Team")
    .setDescription(userReply.content)
    .setAuthor({
      name: originalInteraction.user.tag,
      iconURL: originalInteraction.user.displayAvatarURL(),
    })
    .setTimestamp(new Date());

  const responseMessage: MessageCreateOptions = {
    embeds: [responseEmbed],
  };

  Logger.log(
    "MessageTheAdmiralsCommand",
    `Forwarding user ${originalInteraction.user.tag}'s message to leadership inbox channel.`,
  );
  await leadershipInboxChannel.send(responseMessage);

  if (userReply.attachments.size > 0) {
    // Use a separate message for the files so that the attachments appear after the user's message.
    const filesMessage: MessageCreateOptions = {
      files: [...userReply.attachments.values()].map((attachment) => ({
        attachment: attachment.url,
        name: attachment.name,
      })),
    };

    Logger.log(
      "MessageTheAdmiralsCommand",
      `Forwarding ${userReply.attachments.size} attachments from user ${originalInteraction.user.tag}'s message to leadership inbox channel.`,
    );
    await leadershipInboxChannel.send(filesMessage);
  }
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
    Logger.warn(
      "MessageTheAdmiralsCommand",
      "User did not respond within the time limit.",
    );
    await directMessage.send(
      "The command timed out. Please use the command again if you still want to send a message.",
    );
    return;
  }

  return collected.first();
}

function buildInstructionsMessage(user: User): MessageCreateOptions {
  const message = `
Hello ${user.username.toString()},
  
Please send a message to me with your question or feedback for the leadership team. They will get back to you as soon as possible. You can still attach files if you need to. Just send them as attachments in your reply message.

If you don't reply in the next 5 minutes, you'll need to start over by using the command again.
`;
  return {
    content: message,
  };
}

export default {
  data,
  handler,
};
