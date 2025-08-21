import { useGetBalancesQuery } from '@/services/balanceApi';
import { Addresses } from '@/services/balances';
import { useDispatch } from 'react-redux';
import { updateUser } from '@/stores/user/userSlice';
import { useEffect, useMemo, useRef } from 'react';
import { POLLING_CONFIG } from '@/config/polling';
import { BalancesType } from '@/types';
import { haveBalancesChanged } from '@/utils/balances';
import { AppState, AppStateStatus } from 'react-native';

export function useBalances(addresses: Addresses) {
  const dispatch = useDispatch();
  const lastBalancesRef = useRef<BalancesType | null>(null);

  const shouldSkip = useMemo(
    () => !addresses.eth || !addresses.btc || !addresses.sol || !addresses.sui,
    [addresses.eth, addresses.btc, addresses.sol, addresses.sui],
  );

  const { data: balances, refetch } = useGetBalancesQuery(addresses, {
    skip: shouldSkip,
    pollingInterval: POLLING_CONFIG.BALANCE_POLLING_INTERVAL,
    refetchOnMountOrArgChange: POLLING_CONFIG.REFETCH_ON_MOUNT_OR_ARG_CHANGE,
  });

  useEffect(() => {
    if (balances) {
      const hasChanged = haveBalancesChanged(lastBalancesRef.current, balances);

      if (hasChanged) {
        dispatch(updateUser({ balances }));
        lastBalancesRef.current = balances;
      } else {
        return;
      }
    }
  }, [balances, dispatch]);

  useEffect(() => {
    if (!POLLING_CONFIG.STOP_POLLING_ON_BACKGROUND) return;

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active' && !shouldSkip) {
        refetch();
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [refetch, shouldSkip]);
}
