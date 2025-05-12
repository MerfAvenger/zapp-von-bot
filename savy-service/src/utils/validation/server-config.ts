import { ServerConfig } from "../../types";

export default function isValidServerConfig(
  config?: Partial<ServerConfig>
): config is ServerConfig {
  if (!config) {
    return false;
  }

  if (typeof config.port !== "number") {
    return false;
  }

  return true;
}

export function assertIsValidServerConfig(
  config: Partial<ServerConfig>
): asserts config is ServerConfig {
  if (!isValidServerConfig(config)) {
    throw new Error("Invalid server configuration.");
  }
}
