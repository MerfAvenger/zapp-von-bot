import {
  ChatInputCommandInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import {
  loadSettingsForServer,
  updateSettingsForServer,
} from "../../../../../settings/server";

export const data = new SlashCommandSubcommandBuilder()
  .setName("add-admin-role")
  .setDescription("Add admin permissions to a role.")
  .addRoleOption((option) =>
    option
      .setName("role")
      .setDescription("The role to grant admin permissions to.")
      .setRequired(true),
  );

const handler = async (interaction: ChatInputCommandInteraction) => {
  const settings = loadSettingsForServer(interaction.guildId);

  const roleIdInput = interaction.options.getRole("role", true);

  updateSettingsForServer(interaction.guildId, {
    permissions: {
      adminRoles: [...settings.permissions.adminRoles, roleIdInput.id],
    },
  });

  await interaction.editReply({
    content: `The admin role has been set to ${roleIdInput.name}.`,
  });
};

export default {
  data,
  handler,
};
