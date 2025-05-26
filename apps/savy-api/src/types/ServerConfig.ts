import type { PoolConfig } from "pg";

/**
 * Savy configuration object holding vital settings for the API.
 *
 * @property baseUrl - The base URL for the Savy API.
 * @property checksumKey - The key used to generate the checksum for the Savy API.
 * @property idleTimeout - The idle timeout in seconds for the Savy API.
 */
type SavyConfig = {
  baseUrl: string;
  deviceType: string;
  checksumKey: string;
  idleTimeout: number;
};

type ServerConfig = {
  port: number;
  database: PoolConfig;
  savy: SavyConfig;
};

export default ServerConfig;
