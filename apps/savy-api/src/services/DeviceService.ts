import {
  Device,
  DeviceAuthentication,
  DeviceData,
} from "../../../../packages/model/types";
import pool from "../database/pool";
import {
  GET_DEVICES,
  INSERT_DEVICE,
  UPDATE_DEVICE,
} from "../database/queries/device";
import { makeQuery } from "../database/query";
import { isValidDeviceData } from "../utils/validation/device";
import {
  mapDeviceDataToDevice,
  mapDeviceToDeviceData,
} from "../utils/map/device";
import {
  buildDeviceAuthenticationParams,
  createDeviceKey,
  hasDeviceAuthenticationExpired as deviceAuthenticationHasExpired,
} from "../utils/savy/device";
import Logger from "../logger/Logger";
import { buildSavyUrl, SAVY_API_ENDPOINTS } from "../utils/savy/endpoints";
import Extractor from "../xml/Extractor";

const logger = Logger.createWrapper("DeviceService");

export default class DeviceService {
  static async getDevice(): Promise<Device | null> {
    const deviceData = (
      await makeQuery<DeviceData>(pool, GET_DEVICES, [], isValidDeviceData)
    )[0];

    if (!deviceData) {
      logger.warn("No devices found.");
      return null;
    }

    const device = mapDeviceDataToDevice(deviceData);

    logger.log("Device found:", device);
    return device;
  }

  static async createDevice(): Promise<Device | null> {
    const deviceKey = createDeviceKey();

    const createdDevice = (
      await makeQuery<DeviceData>(
        pool,
        INSERT_DEVICE,
        [deviceKey],
        isValidDeviceData
      )
    )[0];

    if (!createdDevice) {
      logger.error("No device created.");
      return null;
    }

    const device = mapDeviceDataToDevice(createdDevice);

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

  static async updateDevice(device: Device): Promise<Device | null> {
    if (!device) {
      logger.error("No device provided for update.");
      throw new Error("No device provided for update.");
    }

    const deviceData = mapDeviceToDeviceData(device);
    const updatedDeviceData = (
      await makeQuery<DeviceData>(
        pool,
        UPDATE_DEVICE,
        [deviceData.access_token, deviceData.last_login, deviceData.device_key],
        isValidDeviceData
      )
    )[0];

    const updatedDevice = mapDeviceDataToDevice(updatedDeviceData);
    if (!updatedDevice) {
      logger.error("Failed to update device.");
      throw new Error("Failed to update device.");
    }

    logger.log("Device updated:", updatedDevice);
    return updatedDevice;
  }

  static async authenticateDevice(device: Device): Promise<Device> {
    const params = buildDeviceAuthenticationParams(device);
    const url = buildSavyUrl(SAVY_API_ENDPOINTS.device.deviceLogin, params);

    const response = await fetch(url, {
      method: "POST",
    })
      .then(async (res) => {
        if (!res.ok) {
          logger.error("Error in response:", res);
          throw new Error("Failed to authenticate device.");
        }
        return await res.text();
      })
      .catch((error) => {
        logger.error("Error fetching device authentication:", error);
        throw new Error("Failed to authenticate device.");
      });

    const authenticationData = new Extractor(response, [
      "UserLogin",
    ]).extract<DeviceAuthentication>(["UserService", "UserLogin"], {
      accessToken: "accessToken", // Yes, this is lowercase. Thanks Savy.
      lastLogin: "PreviousLastLoginDate",
    })[0];

    if (!authenticationData) {
      throw new Error("Failed to authenticate device.");
    }

    logger.log("Device authenticated:", authenticationData);

    const updatedDevice = await this.updateDevice({
      ...device,
      ...authenticationData,
    });

    if (!updatedDevice) {
      console.warn("Failed to update device after authentication.");
      throw new Error("Failed to update device after authentication.");
    }

    return updatedDevice;
  }
}
