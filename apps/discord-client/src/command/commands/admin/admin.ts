import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

import resetCommands from "./subcommands/reset-commands";

import Logger from "logger";
import { InvalidCommandError } from "../../../error/errors";
import { assertHasRequiredPermissions } from "../../utils";
import { loadSettingsForServer } from "../../../settings/server";

const subCommands = [resetCommands];

const data = new SlashCommandBuilder()
  .setName("admin")
  .setDescription("Admin tools for managing the bot.");

subCommands.forEach((cmd) => {
  data.addSubcommand(cmd.data);
});

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
