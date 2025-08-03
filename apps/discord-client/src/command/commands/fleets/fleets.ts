import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import fleetOption from "../../options/fleet";

const data = new SlashCommandBuilder()
  .setName("fleet")
  .setDescription("Get information about fleets.")
  .addSubcommand((stars) =>
    stars
      .setName("stars")
      .setDescription("Get information about a specific fleet.")
      .addStringOption(fleetOption.setRequired(true))
  )
  .addSubcommand((users) =>
    users
      .setName("users")
      .setDescription("Get users in a specific fleet.")
      .addStringOption(fleetOption.setRequired(true))
  );
