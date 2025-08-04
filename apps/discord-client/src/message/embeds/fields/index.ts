import { APIEmbedField } from "discord.js";

export const currentFleetField = (
  fleetName: string,
  inline = true
): APIEmbedField => ({
  name: "Current Fleet",
  value: fleetName || "No fleet",
  inline,
});

export const currentRankField = (
  rank: string,
  inline = true
): APIEmbedField => ({
  name: "Rank",
  value: rank || "No rank",
  inline,
});

export const currentTrophiesField = (
  trophies: string | number,
  inline = false
): APIEmbedField => ({
  name: "Trophies",
  value: trophies.toString(),
  inline,
});

export const currentDivisionField = (
  division: string,
  inline = true
): APIEmbedField => ({
  name: "Division",
  value: division || "No division",
  inline,
});

export const currentStarsField = (
  stars: string | number,
  inline = true
): APIEmbedField => ({
  name: "Stars",
  value: stars.toString(),
  inline,
});

export const currentNumberOfUsersField = (
  numberOfUsers: string | number,
  inline = true
): APIEmbedField => ({
  name: "Number of Users",
  value: numberOfUsers.toString(),
  inline,
});
