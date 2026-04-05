import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandBuilder,
} from "discord.js";

import redeployCommands from "./subcommands/redeployCommands";
import addAdminRole from "./subcommands/roles/addAdminRole";
import removeAdminRole from "./subcommands/roles/removeAdminRole";

import Logger from "logger";
import { InvalidCommandError } from "../../../error/errors";
import { assertHasRequiredPermissions } from "../../utils";
import { loadSettingsForServer } from "../../../settings/server";

const subCommands = [redeployCommands, addAdminRole, removeAdminRole];

const data = new SlashCommandBuilder()
  .setName("admin")
  .setDescription("Admin tools for managing the bot.");

subCommands.forEach((cmd) => {
  data.addSubcommand(cmd.data);
});

const handler = async (interaction: ChatInputCommandInteraction) => {
  const { adminRoles } = loadSettingsForServer(interaction.guildId).permissions;
  assertHasRequiredPermissions(interaction.guild, interaction.user, adminRoles);

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
