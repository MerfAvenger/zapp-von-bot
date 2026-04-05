import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  RoleSelectMenuBuilder,
  RoleSelectMenuInteraction,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import {
  loadSettingsForServer,
  updateSettingsForServer,
} from "../../../../settings/server";
import {
  CommandTimeoutError,
  NoAdminRolesError,
} from "../../../../error/errors";
import Logger from "logger";
import { createRoleSelectMenuRow } from "../../../../message/components/menus/roleSelect";
import { createCancelButtonRow } from "../../../../message/components/buttons/cancel";

const CANCEL_BUTTON_ID = "admin-role-cancel-button";
const ROLE_MENU_ID = "admin-role-select-menu";

export const data = new SlashCommandSubcommandBuilder()
  .setName("admin-roles")
  .setDescription(
    "Open a role selection menu to manage roles with admin access to commands.",
  );

const handler = async (interaction: ChatInputCommandInteraction) => {
  const settings = loadSettingsForServer(interaction.guildId);

  const adminRoleIds = settings.permissions.adminRoles;

  if (adminRoleIds.length === 0) {
    throw new NoAdminRolesError();
  }

  Logger.info(
    "AdminRoles",
    `Building role menu with admin role IDs: ${adminRoleIds.join(", ")}`,
  );

  const roleMenu = createRoleSelectMenuRow(
    adminRoleIds,
    "Select the roles which have admin permissions. Removing a role from this list will revoke its admin access to bot commands.",
    ROLE_MENU_ID,
    1,
  );

  const cancelButton = createCancelButtonRow(CANCEL_BUTTON_ID);

  await interaction.editReply({
    components: [roleMenu, cancelButton],
  });

  const response = await interaction.channel
    ?.awaitMessageComponent({
      filter: (i) =>
        ((i.customId === ROLE_MENU_ID && i.isRoleSelectMenu()) ||
          (i.customId === CANCEL_BUTTON_ID && i.isButton())) &&
        i.user.id === interaction.user.id,
      time: 60000,
    })
    .catch(() => {
      throw new CommandTimeoutError(interaction.user, "admin-role-management");
    });

  if (!response) {
    return;
  }

  if (response.customId === CANCEL_BUTTON_ID) {
    Logger.info(
      "AdminRoles",
      `User "${interaction.user.username}" cancelled admin role management.`,
    );
    await response.update({
      content: "Admin role management cancelled.",
      components: [],
    });
    return;
  }

  const selectedRoles = (response as RoleSelectMenuInteraction).values;

  await response.update({
    content: `Admin roles updated to: ${selectedRoles.map((r) => `<@&${r}>`).join(", ")}`,
    components: [],
  });

  updateSettingsForServer(interaction.guildId, {
    permissions: {
      adminRoles: selectedRoles,
    },
  });

  Logger.info(
    "AdminRoles",
    `User "${interaction.user.username}" selected roles to have admin permissions.`,
    selectedRoles,
  );
};

export default {
  data,
  handler,
};
