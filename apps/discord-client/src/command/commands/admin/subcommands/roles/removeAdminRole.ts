import {
  ActionRowBuilder,
  ChatInputCommandInteraction,
  RoleSelectMenuBuilder,
  RoleSelectMenuInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import {
  loadSettingsForServer,
  updateSettingsForServer,
} from "../../../../../settings/server";
import {
  CommandTimeoutError,
  NoAdminRolesError,
} from "../../../../../error/errors";
import Logger from "logger";

export const data = new SlashCommandSubcommandBuilder()
  .setName("remove-admin-role")
  .setDescription(
    "Open a role selection menu and choose which role to remove admin permissions from.",
  );

const handler = async (interaction: ChatInputCommandInteraction) => {
  const settings = loadSettingsForServer(interaction.guildId);

  const adminRoleIds = settings.permissions.adminRoles;

  if (adminRoleIds.length === 0) {
    throw new NoAdminRolesError();
  }

  Logger.info(
    "RemoveAdminRole",
    `Building role menu with admin role IDs: ${adminRoleIds.join(", ")}`,
  );
  const roleMenu = new RoleSelectMenuBuilder()
    .setCustomId("remove-admin-role-menu")
    .setPlaceholder("Select a role to remove admin permissions from")
    .addDefaultRoles(adminRoleIds);

  const roleMenuComponent =
    new ActionRowBuilder<RoleSelectMenuBuilder>().addComponents(roleMenu);

  await interaction.editReply({
    content: "Select a role to remove admin permissions from:",
    components: [roleMenuComponent],
  });

  const selectedRole = await interaction.channel
    ?.awaitMessageComponent({
      filter: (i) =>
        i.customId === "remove-admin-role-menu" &&
        i.user.id === interaction.user.id &&
        i.isRoleSelectMenu(),
      time: 60000,
    })
    .catch(() => {
      throw new CommandTimeoutError(interaction.user, "remove-admin-role");
    });

  if (!selectedRole) {
    Logger.warn(
      "RemoveAdminRole",
      `User "${interaction.user.username}" did not select a role in time.`,
    );
    await interaction.editReply({
      content: "No role was selected. Please try the command again.",
      components: [],
    });
    return;
  }

  const roleSelectInteraction = selectedRole as RoleSelectMenuInteraction;
  const roleIdToRemove = roleSelectInteraction.values[0];

  const updatedAdminRoles = adminRoleIds.filter((id) => id !== roleIdToRemove);

  updateSettingsForServer(interaction.guildId, {
    permissions: {
      adminRoles: updatedAdminRoles,
    },
  });

  Logger.info(
    "RemoveAdminRole",
    `User "${interaction.user.username}" selected a role to remove admin permissions from.`,
    selectedRole,
  );
};

export default {
  data,
  handler,
};
