import { Pool, PoolConfig } from "pg";
import config from "../config";
import Logger from "logger";

const logger = Logger.createWrapper("DatabasePool");

const poolConfig: PoolConfig = {
  host: config.database.host,
  database: config.database.database,
  user: config.database.user,
  password: config.database.password,
  port: config.database.port,
  max: config.database.max,
  idleTimeoutMillis: config.database.idleTimeoutMillis,
  connectionTimeoutMillis: config.database.connectionTimeoutMillis,
};

logger.log(
  "Creating database connection pool with the following config:",
  poolConfig
);

// We want to reuse the same pool instance across the service, so we export it as an instance as a pseudo-singleton.
const pool = new Pool(poolConfig);
pool.on("error", (err) => {
  logger.error("Unexpected error on idle client", err);
  process.exit(-1);
});

export default pool;
