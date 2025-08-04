export const SAVY_BASE_URL = process.env.SAVY_BASE_URL || null;

export const SAVY_API_ENDPOINTS = {
  device: {
    deviceLogin: `/UserService/DeviceLogin11`,
    userLogin: `/UserService/UserEmailPasswordAuthorize2`,
  },
  fleet: {
    getUser: `/AllianceService/GetUser`,
    getListUsers: `/AllianceService/ListUsers`,
    searchFleets: `/AllianceService/SearchAlliances`,
    getTournamentFleets: `AllianceService/ListAlliancesWithDivision`,
    getTournamentDivisionFleets: `AllianceService/ListAlliancesByDivision`,
  },
  user: {
    getUserById: `/UserService/GetUser`,
    searchUsers: `UserService/SearchUsers`,
  },
};

export const buildSavyUrl = (
  endpoint: string,
  params: Record<string, string>
): string => {
  const paramsString = new URLSearchParams(params).toString();
  return `${SAVY_BASE_URL}/${endpoint}?${paramsString}`;
};
