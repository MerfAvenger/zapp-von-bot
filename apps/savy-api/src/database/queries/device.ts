export const GET_DEVICES = "SELECT * FROM devices";

export const INSERT_DEVICE = `
  INSERT INTO devices (device_key, access_token, last_login)
  VALUES ($1, $2, $3)
  RETURNING id, device_key, access_token, last_login
  `;
