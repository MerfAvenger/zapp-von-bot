import { ComponentType, RoleSelectMenuBuilder, Snowflake } from "discord.js";
import Logger from "logger";

export function createRoleSelectMenu(
  preselectedRoles: Snowflake[],
  placeholder?: string,
  customId?: string,
  minValues?: number,
  maxValues?: number,
) {
  const id = customId || "role-menu";
  const minValue = minValues ?? 0;
  const maxValue = maxValues ?? (preselectedRoles.length || 1);
  const placeHolderText = placeholder || "Select a role (or multiple roles)";

  Logger.info(
    "Creating role select menu with preselected roles:",
    preselectedRoles.join(", "),
    id,
    minValue,
    maxValue,
  );

  const roleMenu = new RoleSelectMenuBuilder().setCustomId(
    customId || "role-menu",
  );

  if (preselectedRoles.length > 0) {
    roleMenu.setDefaultRoles(preselectedRoles);
  }

  roleMenu.setPlaceholder(placeHolderText);
  roleMenu.setMinValues(minValue);
  roleMenu.setMaxValues(maxValue);

  return roleMenu;
}

export function createRoleSelectMenuRow(
  preselectedRoles: Snowflake[],
  placeholder?: string,
  customId?: string,
  minValues?: number,
  maxValues?: number,
) {
  const roleMenu = createRoleSelectMenu(
    preselectedRoles,
    placeholder,
    customId,
    minValues,
    maxValues,
  );
  return {
    type: ComponentType.ActionRow,
    components: [roleMenu],
  };
}
