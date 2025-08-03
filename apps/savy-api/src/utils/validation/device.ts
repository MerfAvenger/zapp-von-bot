import {
  Device,
  DeviceAuthentication,
  DeviceData,
} from "../../../../../packages/model/types";
import Logger from "logger";
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

export function isValidDeviceAuthentication(
  deviceAuthentication: unknown
): deviceAuthentication is DeviceAuthentication {
  if (
    typeof deviceAuthentication !== "object" ||
    deviceAuthentication === null
  ) {
    return false;
  }

  const auth = deviceAuthentication as DeviceAuthentication;

  if (typeof auth.accessToken !== "string" && auth.accessToken !== null) {
    logger.warn("Invalid access token:", auth.accessToken);
    return false;
  }

  if (typeof auth.lastLogin !== "string" && auth.lastLogin !== null) {
    logger.warn("Invalid last login time:", auth.lastLogin);
    return false;
  }

  return true;
}
