import { BalancesType, useAllBalances } from '@/hooks/useGetBalances';
import { RootState } from '@/stores/store';
import AppLoader from '@components/ui/AppLoader';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useHeaderHeight } from '@react-navigation/elements';
import AppInput from '@components/ui/AppInput';
import { useCallback, useMemo, useState } from 'react';
import CryptoIcon from '@ledgerhq/crypto-icons/native';
import { router } from 'expo-router';
import { AssetMeta } from '@/types';

const assetsMeta: AssetMeta[] = [
  { key: 'eth', label: 'ETH', ledgerId: 'ethereum', isNative: true, decimals: 18 },
  { key: 'btc', label: 'BTC', ledgerId: 'bitcoin', isNative: true, decimals: 8 },
  { key: 'sol', label: 'SOL', ledgerId: 'solana', isNative: true, decimals: 9 },
  { key: 'sui', label: 'SUI', ledgerId: 'sui', isNative: true, decimals: 9 },
  {
    key: 'usdt-eth',
    label: 'USDT',
    ledgerId: 'ethereum',
    isNative: false,
    tokenAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
  },
];
const SendScreen = () => {
  /* Hooks */
  const user = useSelector((state: RootState) => state.user.data);
  const { balances, balancesLoading } = useAllBalances({
    eth: user?.address ?? '',
    btc: user?.btc ?? '',
    sol: user?.solana ?? '',
    sui: user?.sui ?? '',
  });
  const headerHeight = useHeaderHeight();

  /* State */
  const [searchValue, setSearchValue] = useState('');

  const filteredAssets = useMemo(
    () =>
      assetsMeta.filter(
        asset =>
          searchValue.trim() === '' ||
          asset.label.toLowerCase().startsWith(searchValue.toLowerCase()),
      ),
    [searchValue],
  );

  /* Handlers */
  const handleNavigate = useCallback((asset: AssetMeta) => {
    router.push({
      pathname: '/send/transaction',
      params: {
        token: JSON.stringify(asset),
      },
    });
  }, []);

  if (balancesLoading) {
    return (
      <View style={{ flex: 1, marginBottom: headerHeight }}>
        <AppLoader />
      </View>
    );
  }

  return (
    <View>
      <Text style={{ textAlign: 'center', marginBottom: 20, fontSize: 20 }}>
        Select asset to send
      </Text>
      <AppInput
        placeholder="Search for assets"
        value={searchValue}
        onChange={setSearchValue}
        isPassword={false}
        size="screen"
        icon="search"
      />

      <FlatList
        data={filteredAssets}
        keyExtractor={item => item.key}
        contentContainerStyle={{ marginTop: 20 }}
        renderItem={({ item: asset }) => (
          <Pressable onPress={() => handleNavigate(asset)} style={styles.assetRow}>
            <View style={styles.assetLeft}>
              <CryptoIcon ticker={asset.label} ledgerId={asset.ledgerId} size={20} />
              <Text style={styles.assetLabel}>{asset.label}</Text>
            </View>

            <Text style={styles.assetBalance}>
              {typeof balances[asset.key as keyof BalancesType] === 'number'
                ? balances[asset.key as keyof BalancesType].toFixed(6)
                : '0.000000'}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};
export default SendScreen;

const styles = StyleSheet.create({
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetLabel: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  assetBalance: {
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
});
