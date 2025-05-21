import type { PoolConfig } from "pg";

type ServerConfig = {
  port: number;
  database: PoolConfig;
};

export default ServerConfig;
