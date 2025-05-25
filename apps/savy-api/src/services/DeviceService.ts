import { Device } from "../../../../packages/model/types";
import pool from "../database/pool";
import { GET_DEVICES, INSERT_DEVICE } from "../database/queries/device";
import { makeQuery } from "../database/query";
import { isValidDevice } from "../utils/validation/device";
import {
  createDeviceKey,
  DEVICE_TIMESTAMP_FORMAT,
  hasDeviceAuthenticationExpired as deviceAuthenticationHasExpired,
} from "../utils/savy/device";
import { DOMParser } from "xmldom";
import xpath from "xpath";

import Logger from "../logger/Logger";
import config from "../config";
import moment from "moment";
import { md5 } from "js-md5";
const SYSTEM_NAME = "DeviceService";

const DEVICE_LOGIN_PATH = "/UserService/DeviceLogin11";

export default class DeviceService {
  static async getDevice(): Promise<Device | null> {
    const devices = await makeQuery<Device[]>(
      pool,
      GET_DEVICES,
      [],
      isValidDevice
    );

    if (!devices || devices.length === 0) {
      Logger.warn(SYSTEM_NAME, "No devices found.");
      return null;
    }

    const device = devices[0];

    Logger.log(SYSTEM_NAME, "Device found:", device);

    return device;
  }

  static async createDevice(): Promise<Device | null> {
    const deviceKey = createDeviceKey();

    const createdDevice = await makeQuery<Device[]>(
      pool,
      INSERT_DEVICE,
      [deviceKey],
      isValidDevice
    );

    if (!createdDevice || createdDevice.length === 0) {
      Logger.error(SYSTEM_NAME, "No device created.");
      return null;
    }

    const device = createdDevice[0];

    Logger.log(SYSTEM_NAME, "Device created:", device);
    return device;
  }

  static async getActiveDevice(): Promise<Device> {
    Logger.log(SYSTEM_NAME, "Retrieving active device.");
    const device = await this.getDevice();

    if (!device) {
      Logger.warn(SYSTEM_NAME, "No device found, creating a new one.");
      const newDevice = await this.createDevice();

      if (!newDevice) {
        throw new Error("Failed to create a new device.");
      }

      return newDevice;
    }

    if (deviceAuthenticationHasExpired(device)) {
      Logger.warn(SYSTEM_NAME, "Device authentication has expired.");
      const authenticatedDevice = await this.authenticateDevice(device);

      if (!authenticatedDevice) {
        Logger.error(SYSTEM_NAME, "Failed to authenticate device.");
        throw new Error("Failed to authenticate device.");
      }

      Logger.log(SYSTEM_NAME, "Device re-authenticated:", authenticatedDevice);
      return authenticatedDevice;
    }

    return device;
  }

  static async authenticateDevice(device: Device): Promise<Device> {
    const params = {
      advertisingKey: "",
      deviceKey: device.device_key,
      clientDateTime: moment().utc().format(DEVICE_TIMESTAMP_FORMAT),
      deviceType: "DeviceTypeAndroid",
    };

    const checksumString =
      params.deviceKey +
      params.clientDateTime +
      params.deviceType +
      config.savy.checksumKey +
      "savysoda";

    params["checksum"] = md5(checksumString);

    const paramsString = new URLSearchParams(params).toString();

    const url = `${config.savy.baseUrl}${DEVICE_LOGIN_PATH}?${paramsString}`;

    const response = await fetch(url, {
      method: "POST",
    }).then((res) => {
      if (!res.ok) {
        Logger.error(SYSTEM_NAME, "Error in response:", res);
        throw new Error("Failed to authenticate device.");
      }
      return res.text();
    });

    const xmlDoc = new DOMParser();

    const errorPath = "//UserLogin/@errorMessage";
    const errorMessage = xpath.select(
      errorPath,
      xmlDoc.parseFromString(response, "text/xml")
    );

    if (Array.isArray(errorMessage) && errorMessage.length > 0) {
      const error = errorMessage[0].nodeValue;
      Logger.error(SYSTEM_NAME, "Error in response:", error);
      throw new Error("Failed to authenticate device.");
    }

    const accessTokenPath = "//UserLogin/@accessToken";

    const accessToken = xpath.select(
      accessTokenPath,
      xmlDoc.parseFromString(response, "text/xml")
    );

    if (accessToken) {
      const token = accessToken[0].nodeValue;
      Logger.log(SYSTEM_NAME, "Access token:", token);
      device.access_token = token;
      device.last_login = params.clientDateTime;
    } else {
      Logger.error(SYSTEM_NAME, "No access token found in response.");
      throw new Error("Failed to authenticate device.");
    }

    return device;
  }
}
