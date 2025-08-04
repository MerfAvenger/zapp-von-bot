import "dotenv/config";

const DISCORD_CLIENT_PORT = process.env.DISCORD_CLIENT_PORT
  ? parseInt(process.env.DISCORD_CLIENT_PORT, 10)
  : 8083;

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN || "";
if (!DISCORD_BOT_TOKEN) {
  throw new Error("DISCORD_BOT_TOKEN is not set in the environment variables.");
}

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || "";
if (!DISCORD_CLIENT_ID) {
  throw new Error("DISCORD_CLIENT_ID is not set in the environment variables.");
}

const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || "";
if (!DISCORD_CLIENT_SECRET) {
  throw new Error(
    "DISCORD_CLIENT_SECRET is not set in the environment variables."
  );
}

const SAVY_API_HOST = process.env.SAVY_API_HOST;
if (!SAVY_API_HOST) {
  throw new Error("SAVY_API_HOST is not set in the environment variables.");
}

const SAVY_API_PORT = process.env.SAVY_API_PORT;
if (!SAVY_API_PORT) {
  throw new Error("SAVY_API_PORT is not set in the environment variables.");
}

const SAVY_API_URL =
  "http://" + process.env.SAVY_API_HOST + ":" + process.env.SAVY_API_PORT;

export default {
  port: DISCORD_CLIENT_PORT,
  token: DISCORD_BOT_TOKEN,
  clientId: DISCORD_CLIENT_ID,
  clientSecret: DISCORD_CLIENT_SECRET,
  savyAPIURL: SAVY_API_URL,
  style: {
    defaultEmbedColour: process.env.DEFAULT_EMBED_COLOUR || "#b01818",
    errorEmbedColour: process.env.ERROR_EMBED_COLOUR || "#fdc22bff",
  },
};
