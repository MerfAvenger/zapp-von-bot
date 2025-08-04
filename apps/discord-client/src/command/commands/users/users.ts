import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import searchUser from "./sub-commands/searchUser";
import Logger from "logger";

const data = new SlashCommandBuilder()
  .setName("users")
  .setDescription("Get information about users.")
  .addSubcommand(searchUser.data);

const handler = async (interaction: ChatInputCommandInteraction) => {
  const subCommand = interaction.options.getSubcommand();

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  Logger.log("UsersCommand", `Received subcommand: ${subCommand}`);

  switch (subCommand) {
    case "search":
      await searchUser.handler(interaction).catch((error) => {
        Logger.error(
          "UsersCommandError",
          "Error handling search user command",
          error
        );
        interaction.editReply({
          content: "An error occurred while searching for users.",
        });
      });
      break;
    default:
      await interaction.editReply({
        content: "Unknown subcommand.",
      });
      break;
  }
};

export default {
  data,
  handler,
};
