import { ServerConfig } from "./types";
import { assertIsValidServerConfig } from "./utils/validation/server-config";

import "dotenv/config";

const port = parseInt(process.env.SERVER_PORT) || 3000;

const databaseHost = process.env.SERVER_DATABASE_HOST || "database";
const databasePort = parseInt(process.env.POSTGRES_PORT) || 5432;

const databaseUser = process.env.POSTGRES_USER;
const databasePassword = process.env.POSTGRES_PASSWORD;
const databaseName = process.env.POSTGRES_DB;

const databaseMaxConnections =
  parseInt(process.env.SERVER_DATABASE_MAX_CONNECTIONS) || 10;
const databaseIdleTimeout =
  parseInt(process.env.SERVER_DATABASE_IDLE_TIMEOUT) || 10000;
const databaseConnectionTimeout =
  parseInt(process.env.SERVER_DATABASE_CONNECTION_TIMEOUT) || 2000;

if (!databaseUser || !databasePassword || !databaseName) {
  throw new Error(
    "Cannot initialise database: There are missing credentials in the environment variables."
  );
}

const savyIdleTimeout = parseInt(process.env.SAVY_IDLE_TIMEOUT_SECONDS) || 5;
const savyChecksumKey = process.env.SAVY_CHECKSUM_KEY;
const deviceType = process.env.SAVY_DEVICE_TYPE || "DeviceTypeAndroid";

const savyBaseUrl = process.env.SAVY_BASE_URL;

if (!savyBaseUrl) {
  throw new Error(
    "Cannot initialise: There is no base URL for the Savy API in the environment variables."
  );
}

if (!savyChecksumKey) {
  throw new Error(
    "Cannot initialise: There is no checksum key in the environment variables."
  );
}

const config: ServerConfig = {
  port,
  database: {
    host: databaseHost,
    port: databasePort,
    user: databaseUser,
    password: databasePassword,
    database: databaseName,
    max: databaseMaxConnections,
    idleTimeoutMillis: databaseIdleTimeout,
    connectionTimeoutMillis: databaseConnectionTimeout,
  },
  savy: {
    baseUrl: savyBaseUrl,
    checksumKey: savyChecksumKey,
    deviceType,
    idleTimeout: savyIdleTimeout,
  },
};

assertIsValidServerConfig(config);

export default config;
