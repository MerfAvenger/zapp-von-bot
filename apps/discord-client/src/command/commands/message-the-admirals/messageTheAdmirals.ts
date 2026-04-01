import {
  ChatInputCommandInteraction,
  DMChannel,
  EmbedBuilder,
  Message,
  MessageFlags,
  SlashCommandBuilder,
  TextBasedChannel,
  TextChannel,
  User,
} from "discord.js";
import Logger from "logger";
import {
  FailedToSendDMError,
  MissingConfigurationError,
} from "../../../error/errors";
import { loadSettings } from "../../../settings/settings";

const data = new SlashCommandBuilder()
  .setName("message-the-admirals")
  .setDescription("Privately send a message to the leadership team.");

const handler = async (interaction: ChatInputCommandInteraction) => {
  const forwardChannelId = getForwardChannelId();

  await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });

  Logger.log(
    "MessageTheAdmiralsCommand",
    "Received command to message the admirals.",
  );

  const directMessage = await openDM(interaction);
  const userResponse = await collectUserMessage(directMessage, interaction);

  if (userResponse) {
    await forwardResponseToChannel(interaction, userResponse, forwardChannelId);
  }
};

function getForwardChannelId(): string {
  const { channelId } = loadSettings().messageTheAdmirals;

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
 * Opens a DM channel with the user and sends them instructions on how to message the leadership team.
 *
 * @param interaction The discord interaction object.
 * @returns The direct message channel or throws if failed.
 */
async function openDM(
  interaction: ChatInputCommandInteraction,
): Promise<DMChannel> {
  const user = interaction.user;
  const directMessage = await user.createDM();

  await directMessage
    .send(buildInstructionsMessage(user))
    .then(async () => {
      await interaction.editReply({
        content:
          "Reply to the message in your DMs to send a message to the admirals.",
      });
    })
    .catch(async (error) => {
      Logger.error(
        "MessageTheAdmiralsCommand",
        "Failed to send DM to user:",
        error,
      );
      await interaction.editReply({
        content:
          "I couldn't send you a direct message. Please check your privacy settings and try again.",
      });

      throw new FailedToSendDMError(user, error);
    });

  return directMessage;
}

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

function buildInstructionsMessage(user: User) {
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
