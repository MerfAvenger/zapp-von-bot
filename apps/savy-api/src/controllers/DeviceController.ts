import { Handler, Request, Response } from "express";
import DeviceService from "../services/DeviceService";
import Logger from "../logger/Logger";

const SYSTEM_NAME = "DeviceController";

export default class DeviceController {
  static deviceLogin: Handler = (req, res, _next) => {
    Logger.log(SYSTEM_NAME, "Device login request received.", req);
    DeviceService.getActiveDevice()
      .then((device) => {
        if (!device) {
          Logger.error(SYSTEM_NAME, "Failed to create or retrieve device.");
          res
            .status(500)
            .json({ error: "Failed to create or retrieve device." });
          return;
        }

        Logger.log(SYSTEM_NAME, "Device login successful.", device);
        res.status(200).json(device);
      })
      .catch((error) => {
        Logger.error(SYSTEM_NAME, "Error during device login:", error);
        res
          .status(500)
          .json({ error: "Internal server error during device login." });
      });
  };
}
