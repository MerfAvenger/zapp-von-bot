import { Device, DeviceData } from "../../../../../packages/model/types";
import Logger from "../../logger/Logger";
const logger = Logger.createWrapper("DeviceUtils");



export function isValidDeviceData(device: unknown): device is DeviceData {
  if (typeof device !== "object" || device === null) {
    return false;
  }

  const testDevice = device as DeviceData;

  if (typeof testDevice.id !== "number") {
    logger.warn("Invalid device ID:", testDevice.id);
    return false;
  }

  if (typeof testDevice.device_key !== "string") {
    logger.warn("Invalid device key:", testDevice.device_key);
    return false;
  }

  if (
    testDevice.access_token !== null &&
    typeof testDevice.access_token !== "string"
  ) {
    logger.warn("Invalid access token:", testDevice.access_token);
    return false;
  }

  if (
    typeof testDevice.last_login !== "string" &&
    testDevice.last_login !== null
  ) {
    logger.warn("Invalid last login time:", testDevice.last_login);
    return false;
  }

  return true;
}
