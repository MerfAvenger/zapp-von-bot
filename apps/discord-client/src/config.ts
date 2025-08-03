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

export default {
  port: DISCORD_CLIENT_PORT,
  token: DISCORD_BOT_TOKEN,
  clientId: DISCORD_CLIENT_ID,
  clientSecret: DISCORD_CLIENT_SECRET,
};
