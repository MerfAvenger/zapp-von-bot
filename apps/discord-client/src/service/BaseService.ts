import { ChatInputCommandInteraction } from "discord.js";

export default class BaseService {
  protected static async handleError(
    interaction: ChatInputCommandInteraction,
    error: Error
  ): Promise<void> {
    console.error("Error handling interaction:", error);
    await interaction.reply({
      content: "An error occurred while processing your request.",
      ephemeral: true,
    });
  }
}
