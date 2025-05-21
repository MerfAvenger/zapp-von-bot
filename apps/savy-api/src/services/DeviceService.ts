import { Device } from "../../../../packages/model/types";
import pool from "../database/pool";

export default class DeviceService {
  static async getDevice(): Promise<Device | null> {}
}
