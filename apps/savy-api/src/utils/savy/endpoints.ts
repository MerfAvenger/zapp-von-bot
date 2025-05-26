export const SAVY_BASE_URL = process.env.SAVY_BASE_URL || null;

export const SAVY_API_ENDPOINTS = {
  device: {
    deviceLogin: `${SAVY_BASE_URL}/UserService/DeviceLogin11`,
    userLogin: `${SAVY_BASE_URL}/UserService/UserEmailPasswordAuthorize2`,
  },
  fleet: {
    getUser: `${SAVY_BASE_URL}/AllianceService/GetUser`,
    getListUsers: `${SAVY_BASE_URL}/AllianceService/ListUsers`,
  },
};

export const buildSavyUrl = (
  endpoint: string,
  params: Record<string, string>
): string => {
  const paramsString = new URLSearchParams(params).toString();
  return `${endpoint}?${paramsString}`;
};
