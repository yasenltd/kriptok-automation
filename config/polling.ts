import Constants from 'expo-constants';

export const POLLING_CONFIG = {
  BALANCE_POLLING_INTERVAL: Number(
    Constants.expoConfig?.extra?.EXPO_PUBLIC_BALANCES_FETCH_INTERVAL || 30000,
  ),
  REFETCH_ON_MOUNT_OR_ARG_CHANGE: true,
  STOP_POLLING_ON_BACKGROUND: true,
} as const;
