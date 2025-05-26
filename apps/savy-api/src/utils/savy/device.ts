import moment from "moment";
import { Device } from "../../../../../packages/model/types";
import Logger from "../../logger/Logger";
import config from "../../config";
import { md5 } from "js-md5";

export const DEVICE_TIMESTAMP_FORMAT = "YYYY-MM-DDTHH:mm:ss";

export function createDeviceKey(): string {
  let deviceKey = "";
  const hex = "0123456789abcdef";

  for (let i = 0; i < 16; i++) {
    deviceKey += hex[Math.floor(Math.random() * hex.length)];
  }

  Logger.log("createDeviceKey", "Device key created:", deviceKey);

  return deviceKey;
}

export function createDeviceChecksum(
  device: Device,
  clientDateTime: string
): string {
  const checksumString =
    device.device_key +
    clientDateTime +
    config.savy.deviceType +
    config.savy.checksumKey +
    "savysoda";

  return md5(checksumString);
}

export function buildDeviceAuthenticationParams(
  device: Device
): Record<string, string> {
  const params: Record<string, string> = {
    advertisingKey: "",
    deviceKey: device.device_key,
    clientDateTime: moment().utc().format(DEVICE_TIMESTAMP_FORMAT),
    deviceType: "DeviceTypeAndroid",
  };

  params["checksum"] = createDeviceChecksum(device, params.clientDateTime);

  Logger.log(
    "buildDeviceAuthenticationParams",
    "Authentication parameters:",
    params
  );

  return params;
}

export function hasDeviceAuthenticationExpired(device: Device): boolean {
  if (!device.access_token || !device.last_login) {
    Logger.warn(
      "hasDeviceAuthenticationExpired",
      "Device access token or last login time is missing."
    );
    return true;
  }

  const currentTime = moment();
  const lastLoginTime = moment(device.last_login);

  // Preserve precision by using milliseconds
  const timeDifference = currentTime.diff(lastLoginTime, "milliseconds");

  Logger.log(
    "hasDeviceAuthenticationExpired",
    "Time since last authentication:",
    timeDifference
  );

  return timeDifference > config.savy.idleTimeout * 60 * 1000;
}
