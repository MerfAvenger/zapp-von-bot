import settings from "./commands/settings/settings";
import messageTheAdmiralsCommand from "./commands/message-the-admirals/messageTheAdmirals";
import userCommands from "./commands/users/users";
import admin from "./commands/admin/admin";

export const commandData = [
  admin.data,
  messageTheAdmiralsCommand.data,
  settings.data,
  // userCommands.data,
];

export default [settings, messageTheAdmiralsCommand, userCommands];
