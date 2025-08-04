import {
  ChatInputCommandInteraction,
  MessageFlags,
  SlashCommandSubcommandBuilder,
} from "discord.js";
import { createUserEmbed } from "../../../../message/embeds/users/user";
import { User } from "model";
import config from "../../../../config";
import Logger from "logger";

export const data = new SlashCommandSubcommandBuilder()
  .setName("search")
  .setDescription("Search for a user by name.")
  .addStringOption((option) =>
    option
      .setName("name")
      .setDescription("The name of the user to search for.")
      .setRequired(true)
  );

const handler = async (interaction: ChatInputCommandInteraction) => {
  const userNameInput = interaction.options.getString("name", true);

  const url = `${config.savyAPIURL}/api/user/by-name/${userNameInput}`;
  Logger.log("SearchUserCommand", `Fetching user data from: ${url}`);

  const user = (await fetch(url).then((res) => res.json())) as User | null;

  if (!user) {
    await interaction.editReply({
      content: "User not found.",
    });
    return;
  }

  const userEmbed = createUserEmbed(user);
  await interaction.editReply({
    embeds: [userEmbed],
  });
};

export default {
  data,
  handler,
};
