import { Device } from "../../../../packages/model/types";
import pool from "../database/pool";
import { GET_DEVICES, INSERT_DEVICE } from "../database/queries/device";
import { makeQuery } from "../database/query";
import { isValidDevice } from "../utils/validation/device";
import {
  buildDeviceAuthenticationParams,
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
import { buildSavyUrl, SAVY_API_ENDPOINTS } from "../utils/savy/endpoints";

const logger = Logger.createWrapper("DeviceService");

export default class DeviceService {
  static async getDevice(): Promise<Device | null> {
    const devices = await makeQuery<Device[]>(
      pool,
      GET_DEVICES,
      [],
      isValidDevice
    );

    if (!devices || devices.length === 0) {
      logger.warn("No devices found.");
      return null;
    }

    const device = devices[0];

    logger.log("Device found:", device);

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
      logger.error("No device created.");
      return null;
    }

    const device = createdDevice[0];

    logger.log("Device created:", device);
    return device;
  }

  static async getActiveDevice(): Promise<Device> {
    logger.log("Retrieving active device.");
    const device = await this.getDevice();

    if (!device) {
      logger.warn("No device found, creating a new one.");
      const newDevice = await this.createDevice();

      if (!newDevice) {
        throw new Error("Failed to create a new device.");
      }

      return newDevice;
    }

    if (deviceAuthenticationHasExpired(device)) {
      logger.warn("Device authentication has expired.");
      const authenticatedDevice = await this.authenticateDevice(device);

      if (!authenticatedDevice) {
        logger.error("Failed to authenticate device.");
        throw new Error("Failed to authenticate device.");
      }

      logger.log("Device re-authenticated:", authenticatedDevice);
      return authenticatedDevice;
    }

    return device;
  }

  static async authenticateDevice(device: Device): Promise<Device> {
    const params = buildDeviceAuthenticationParams(device);
    const url = buildSavyUrl(SAVY_API_ENDPOINTS.device.deviceLogin, params);

    const response = await fetch(url, {
      method: "POST",
    }).then((res) => {
      if (!res.ok) {
        logger.error("Error in response:", res);
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
      logger.error("Error in response:", error);
      throw new Error("Failed to authenticate device.");
    }

    const accessTokenPath = "//UserLogin/@accessToken";

    const accessToken = xpath.select(
      accessTokenPath,
      xmlDoc.parseFromString(response, "text/xml")
    );

    if (accessToken) {
      const token = accessToken[0].nodeValue;
      logger.log("Access token:", token);
      device.access_token = token;
      device.last_login = params.clientDateTime;
    } else {
      logger.error("No access token found in response.");
      throw new Error("Failed to authenticate device.");
    }

    return device;
  }
}
