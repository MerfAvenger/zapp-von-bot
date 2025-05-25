export const GET_DEVICES = "SELECT * FROM devices";

export const INSERT_DEVICE = `
  INSERT INTO devices (device_key)
  VALUES ($1)
  RETURNING id, device_key, access_token, last_login
  `;

export const UPDATE_DEVICE = `
  UPDATE devices
  SET access_token = $1, last_login = $2
  WHERE device_key = $3
  RETURNING id, device_key, access_token, last_login
  `;
