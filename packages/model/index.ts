export interface Device {
  id: number;
  device_key: string;
  access_token: string | null;
  last_login: Date | null;
}

export interface User {
  id: number;
  account: string;
  email: string;
  password: string;
}
