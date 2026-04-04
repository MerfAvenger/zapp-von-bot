import settings from "./commands/settings/settings";
import messageTheAdmiralsCommand from "./commands/message-the-admirals/messageTheAdmirals";
import userCommands from "./commands/users/users";

export const commandData = [
  settings.data,
  messageTheAdmiralsCommand.data,
  // userCommands.data,
];

export default [settings, messageTheAdmiralsCommand, userCommands];
