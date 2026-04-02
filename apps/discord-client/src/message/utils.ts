import {
  ChatInputCommandInteraction,
  DMChannel,
  Interaction,
  Message,
  MessageCreateOptions,
  MessagePayload,
} from "discord.js";
import Logger from "logger";
import {
  FailedToCreateDMChannelError,
  FailedToSendDMError,
} from "../error/errors";

/**
 * Opens a DM channel with the user.
 *
 * @param interaction The original command's interaction object.
 * @returns The direct message channel.
 * @throws {FailedToCreateDMChannelError} on channel creation failure.
 */
export async function createDirectMessageChannel(
  interaction: ChatInputCommandInteraction,
): Promise<DMChannel> {
  const user = interaction.user;
  const directMessageChannel = await user.createDM().catch((error) => {
    throw new FailedToCreateDMChannelError(user, error);
  });

  return directMessageChannel;
}

export async function sendDirectMessage(
  dmChannel: DMChannel,
  message: string | MessageCreateOptions | MessagePayload,
): Promise<Message> {
  return await dmChannel.send(message).catch(async (error) => {
    Logger.error("SendDirectMessage", "Failed to send DM to user:", error);
    throw new FailedToSendDMError(dmChannel.recipient, error);
  });
}
