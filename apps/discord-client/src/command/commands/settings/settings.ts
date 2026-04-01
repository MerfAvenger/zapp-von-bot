import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";
import messageTheAdmirals from "./sub-commands/messageTheAdmirals";
import resetCommand from "./sub-commands/reset";
import Logger from "logger";

const data = new SlashCommandBuilder()
  .setName("settings")
  .setDescription("Configure the bot's settings.")
  .addSubcommand(messageTheAdmirals.data)
  .addSubcommand(resetCommand.data);

const handler = async (interaction: ChatInputCommandInteraction) => {
  const subCommand = interaction.options.getSubcommand();

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  Logger.log("Settings", `Received subcommand: ${subCommand}`);

  switch (subCommand) {
    case resetCommand.data.name:
      await resetCommand.handler(interaction);
      break;
    case messageTheAdmirals.data.name:
      await messageTheAdmirals.handler(interaction);
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
