import "dotenv/config";
import { ServerConfig } from "./types";
import { assertIsValidServerConfig } from "./utils/validation/server-config";

const config: ServerConfig = {
  port: parseInt(process.env.PORT),
};

assertIsValidServerConfig(config);

export default config;
