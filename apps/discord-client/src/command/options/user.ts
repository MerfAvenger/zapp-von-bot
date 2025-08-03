import { SlashCommandStringOption } from "discord.js";

export default new SlashCommandStringOption()
  .setName("user")
  .setDescription("The name of the user to search for.");
