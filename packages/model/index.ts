export interface DeviceData {
  id: number;
  device_key: string;
  access_token: string | null;
  last_login: string | null;
}

export interface DeviceAuthentication {
  accessToken: string | null;
  lastLogin: string | null;
}

export interface Device extends DeviceAuthentication {
  id: number;
  deviceKey: string;
}

export interface Account {
  id: number;
  name: string;
  email: string;
  password: string;
}

/**
 *
 */
export interface Fleet {
  id: string;
  name: string;
  users: User[];
}

/**
 * This is an extensible interface of useful properties from the PSS user data.
 */
export interface User {
  id: string;
  name: string;
  trophy: string;
}

/*
 This is an interface for the user data returned from the PSS API. I've tried to remove as much of the unnecessary PII as possible, but if we should remove anything else, feel free to suggest it.
*/
export interface UserInterface {
  AllianceId: number;
  AllianceJoinDate: Date;
  AllianceMembership: string;
  AllianceName: string;
  AllianceQualifyDivisionDesignId: number;
  AllianceScore: number;
  AllianceSpriteId: number;
  AllianceSupplyDonation: number;
  CaptainCharacterDesignId: number;
  ChallengeDesignId: number;
  ChallengeLosses: number;
  ChallengeWins: number;
  ChampionshipScore: number;
  ChatAppearance: number;
  CompletedMissionDesigns: string[];
  CompletedMissionEventIds: string[];
  CooldownExpiry: Date;
  CreationDate: Date;
  CrewDonated: number;
  CrewReceived: number;
  DailyChallengeWinStreak: number;
  DailyMissionsAttempted: string[];
  DailyPVPAttacks: number;
  DailyPvPDefence: number;
  DailyRewardStatus: number;
  DrawsString: string;
  DrawsUsedToday: number;
  ExploredStarSystemIds: string[];
  Flags: number;
  FreeStarbuxReceivedToday: number;
  GameCenterFriendCount: number;
  GameCenterName: string;
  HeroBonusChance: number;
  HighestTrophy: number;
  IconSpriteId: number;
  Id: number;
  LanguageKey: string;
  LastAlertDate: Date;
  LastBoostDate: Date;
  LastCatalogPurchaseDate: Date;
  LastChallengeDesignId: number;
  LastHeartBeatDate: Date;
  LastLoginDate: Date;
  LastPurchaseDate: string;
  LastRewardActionDate: Date;
  LeagueType: string;
  MatchingStatus: string;
  Name: string;
  OwnerUserId: number;
  ProfileImageUrl: string;
  PurchaseRewardPoints: number;
  PVPAttackDraws: number;
  PVPAttackLosses: number;
  PVPAttackWins: number;
  PvPContinuousLosses: number;
  PVPDefenceDraws: number;
  PVPDefenceLosses: number;
  PVPDefenceWins: number;
  Ranking: number;
  RewardsCollectable: boolean;
  RewardsCollectableAmount: number;
  ShipDesignId: number;
  SituationOccurrencesToday: number;
  TaskRerollCount: number;
  TotalBattleSearches: number;
  TotalSupplyDonation: number;
  TournamentBonusScore: number;
  TournamentResetDate: Date;
  TournamentRewardPoints: number;
  Trophy: number;
  TrophyGained: number;
  TutorialStatus: number;
  UnlockedCharacterDesignIds: string[];
  UnlockedShipDesignIds: string[];
  UnlockedSkinKeys: string[];
  UsedRewardPoints: number;
  UserType: string;
  VipExpiryDate: Date;
}
