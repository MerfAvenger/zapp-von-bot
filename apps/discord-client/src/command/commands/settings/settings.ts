import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

import messageTheAdmirals from "./sub-commands/messageTheAdmirals";
import resetCommand from "./sub-commands/reset";
import adminRoleCommand from "./sub-commands/adminRole";

import Logger from "logger";
import { InvalidCommandError } from "../../../error/errors";
import { assertHasRequiredPermissions } from "../../utils";
import { loadSettingsForServer } from "../../../settings/server";

const subCommands = [messageTheAdmirals, resetCommand, adminRoleCommand];

const data = new SlashCommandBuilder()
  .setName("settings")
  .setDescription("Configure the bot's settings.")
  .addSubcommand(messageTheAdmirals.data)
  .addSubcommand(resetCommand.data);

const handler = async (interaction: ChatInputCommandInteraction) => {
  const { configureSettings } = loadSettingsForServer(
    interaction.guildId,
  ).permissions;

  assertHasRequiredPermissions(interaction.guild, interaction.user, [
    configureSettings,
  ]);

  const subCommand = interaction.options.getSubcommand();

  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  Logger.log("Settings", `Received subcommand: ${subCommand}`);

  const commandHandler = subCommands.find(
    (cmd) => cmd.data.name === subCommand,
  );

  if (!commandHandler) {
    throw new InvalidCommandError(subCommand);
  }

  await commandHandler.handler(interaction);
};

export default {
  data,
  handler,
};
