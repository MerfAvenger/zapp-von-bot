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
import {
  isValidDeviceAuthentication,
  isValidDeviceData,
} from "../utils/validation/device";
import {
  mapDeviceDataToDevice,
  mapDeviceToDeviceData,
} from "../utils/map/device";
import {
  buildDeviceAuthenticationParams,
  createDeviceKey,
  hasDeviceAuthenticationExpired as deviceAuthenticationHasExpired,
} from "../utils/savy/device";
import Logger from "logger";
import { buildSavyUrl, SAVY_API_ENDPOINTS } from "../utils/savy/endpoints";
import Extractor from "../xml/Extractor";
import { DeviceAuthenticationError } from "../errors/SavyAPIError";
import { extractDeviceAuthentication } from "../xml/extractors";

const logger = Logger.createWrapper("DeviceService");

export default class DeviceService {
  static async getDevice(): Promise<Device | null> {
    const deviceData = await makeQuery<DeviceData>(
      pool,
      GET_DEVICES,
      [],
      isValidDeviceData
    );

    if (!deviceData?.[0]) {
      logger.warn("No device found in the database.");
      return null;
    }

    const device = mapDeviceDataToDevice(deviceData[0]);

    logger.log("Device found:", device);
    return device;
  }

  static async createDevice(): Promise<Device> {
    const deviceKey = createDeviceKey();

    const createdDevice = (
      await makeQuery<DeviceData>(
        pool,
        INSERT_DEVICE,
        [deviceKey],
        isValidDeviceData
      )
    )[0];

    const device = mapDeviceDataToDevice(createdDevice);

    if (!device) {
      throw new DeviceAuthenticationError("Failed to create new device.");
    }

    logger.log("Device created:", device);
    return device;
  }

  static async updateDevice(device: Device): Promise<Device | null> {
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
      throw new DeviceAuthenticationError("Failed to update device.");
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
          throw new DeviceAuthenticationError(
            `Error authenticating device: ${res.statusText}`
          );
        }
        return await res.text();
      })
      .catch((error) => {
        throw new DeviceAuthenticationError(
          `Failed to authenticate device: ${error.message}`,
          { trace: error.stack }
        );
      });

    const authenticationData = extractDeviceAuthentication(response);

    const updatedDevice = await this.updateDevice({
      ...device,
      ...authenticationData,
    });

    logger.log("Device authenticated:", authenticationData);

    return updatedDevice;
  }

  static async getActiveDevice(): Promise<Device> {
    logger.log("Retrieving active device.");
    let device = await this.getDevice();

    if (!device) {
      logger.warn("No device found, creating a new one.");
      device = await this.createDevice();
    }

    if (deviceAuthenticationHasExpired(device)) {
      logger.warn("Device authentication has expired, refreshing auth.");
      device = await this.authenticateDevice(device);
    }

    return device;
  }

  static async authenticatedFetch<TResponseData>(
    endpointUrl: string,
    params: Record<string, string>,
    extractionCallback: (response: string) => TResponseData
  ): Promise<TResponseData> {
    const device = await this.getActiveDevice();
    const url = buildSavyUrl(endpointUrl, {
      ...params,
      accessToken: device.accessToken,
    });

    logger.log("Making authenticated request to URL:", url);
    const response = await fetch(url, {
      method: "GET",
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new DeviceAuthenticationError(
            `Error making authenticated request: ${res.statusText}`
          );
        }
        return await res.text();
      })
      .catch((error) => {
        throw new DeviceAuthenticationError(
          `Failed to make authenticated request: ${error.message}`,
          { trace: error.stack }
        );
      });

    logger.log("Response received from authenticated request.");
    return extractionCallback(response);
  }
}
