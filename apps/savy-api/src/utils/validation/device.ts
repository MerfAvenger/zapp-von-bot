import { Device } from "../../../../../packages/model/types";

export function isValidDevice(device: unknown): device is Device {
  if (typeof device !== "object" || device === null) {
    return false;
  }

  const testDevice = device as Device;

  if (typeof testDevice.id !== "number") {
    return false;
  }

  if (typeof testDevice.device_key !== "string") {
    return false;
  }

  if (
    testDevice.access_token !== null &&
    typeof testDevice.access_token !== "string"
  ) {
    return false;
  }

  if (
    typeof testDevice.last_login !== "string" &&
    testDevice.last_login !== null
  ) {
    return false;
  }

  return true;
}
