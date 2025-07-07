import { Device, DeviceData } from "../../../../../packages/model/types";

export function mapDeviceDataToDevice(savyDevice: DeviceData): Device {
  return {
    id: savyDevice.id,
    deviceKey: savyDevice.device_key,
    accessToken: savyDevice.access_token,
    lastLogin: savyDevice.last_login,
  };
}

export function mapDeviceToDeviceData(device: Device): DeviceData {
  return {
    id: device.id,
    device_key: device.deviceKey,
    access_token: device.accessToken,
    last_login: device.lastLogin,
  };
}
