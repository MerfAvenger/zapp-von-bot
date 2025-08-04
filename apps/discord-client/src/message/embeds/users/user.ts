import { ColorResolvable, EmbedBuilder } from "discord.js";
import config from "../../../config";
import { User } from "model";
import {
  currentFleetField,
  currentRankField,
  currentTrophiesField,
} from "../fields";

export const createUserEmbed = (user: User) =>
  new EmbedBuilder()
    .setAuthor({
      name: user.name,
    })
    .setColor(config.style.defaultEmbedColour as ColorResolvable)
    .addFields([
      currentTrophiesField(user.trophies),
      currentFleetField(user.currentFleet),
      currentRankField(user.rank),
    ]);
