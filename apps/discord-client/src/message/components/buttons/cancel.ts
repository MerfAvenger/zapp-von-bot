import { ButtonBuilder, ButtonStyle, ComponentType } from "discord.js";

export function createCancelButton(customId?: string) {
  return new ButtonBuilder()
    .setCustomId(customId || "cancel-button")
    .setLabel("Cancel")
    .setStyle(ButtonStyle.Secondary);
}

export function createCancelButtonRow(customId?: string) {
  const cancelButton = createCancelButton(customId);
  return {
    type: ComponentType.ActionRow,
    components: [cancelButton],
  };
}
