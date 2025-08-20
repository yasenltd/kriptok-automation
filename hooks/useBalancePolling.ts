import { useEffect, useMemo, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import { updateUser } from '@/stores/user/userSlice';
import { Addresses, getAllBalances } from '@/services/balances';
import Constants from 'expo-constants';

export function useBalancePollingAll(addresses: Addresses) {
  const dispatch = useDispatch();
  const existingBalances = useSelector((s: RootState) => s.user.data?.balances);
  const balancesRef = useRef(existingBalances);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);

  const ready = useMemo(
    () => Boolean(addresses.eth && addresses.btc && addresses.sol && addresses.sui),
    [addresses.eth, addresses.btc, addresses.sol, addresses.sui],
  );

  const POLL_INTERVAL_MS = Number(Constants.expoConfig?.extra?.EXPO_PUBLIC_BALANCES_FETCH_INTERVAL);

  const poll = useCallback(async () => {
    try {
      const balances = await getAllBalances(addresses);
      dispatch(updateUser({ balances }));
    } catch (e) {
      console.warn('Balance polling failed:', e);
    }
  }, [addresses, existingBalances]);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);
  }, [poll]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const handleAppState = useCallback((next: AppStateStatus) => {
    const wasBg = appState.current.match(/inactive|background/);
    appState.current = next;
    if (next === 'active' && wasBg) start();
    if (next.match(/inactive|background/)) stop();
  }, []);

  useEffect(() => {
    balancesRef.current = existingBalances;
  }, [existingBalances]);

  useEffect(() => {
    if (!ready) return;

    poll();
    start();
    const sub = AppState.addEventListener('change', handleAppState);

    return () => {
      sub.remove();
      stop();
    };
  }, [ready, addresses.eth, addresses.btc, addresses.sol, addresses.sui, dispatch]);
}
