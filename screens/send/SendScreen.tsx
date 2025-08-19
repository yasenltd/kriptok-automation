import { BalancesType } from '@/types';
import { useAllBalances } from '@/hooks/useGetBalances';
import { RootState } from '@/stores/store';
import AppLoader from '@components/ui/AppLoader';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useHeaderHeight } from '@react-navigation/elements';
import AppInput from '@components/ui/AppInput';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CryptoIcon from '@ledgerhq/crypto-icons/native';
import { router } from 'expo-router';
import { AssetMeta } from '@/types';

const SendScreen = () => {
  /* Hooks */
  const user = useSelector((state: RootState) => state.user.data);
  const { balances, balancesLoading } = useAllBalances({
    eth: user?.address,
    btc: user?.btc,
    sol: user?.solana,
    sui: user?.sui,
  });
  const headerHeight = useHeaderHeight();

  /* State */
  const [searchValue, setSearchValue] = useState('');

  const [assetsMeta, setAssetsMeta] = useState<AssetMeta[]>([
    { key: 'eth', label: 'ETH', ledgerId: 'ethereum', isNative: true, decimals: 18, balance: '' },
    { key: 'btc', label: 'BTC', ledgerId: 'bitcoin', isNative: true, decimals: 8, balance: '' },
    { key: 'sol', label: 'SOL', ledgerId: 'solana', isNative: true, decimals: 9, balance: '' },
    { key: 'sui', label: 'SUI', ledgerId: 'sui', isNative: true, decimals: 9, balance: '' },
    { key: 'bnb', label: 'BNB', ledgerId: 'bnb', isNative: true, decimals: 18, balance: '' },
  ]);

  const filteredAssets = useMemo(
    () =>
      assetsMeta.filter(
        asset =>
          searchValue.trim() === '' ||
          asset.label.toLowerCase().startsWith(searchValue.toLowerCase()),
      ),
    [searchValue, assetsMeta],
  );

  /* Handlers */
  const handleNavigate = useCallback(
    (asset: AssetMeta) => {
      router.push({
        pathname: '/send/transaction',
        params: {
          token: JSON.stringify(asset),
        },
      });
    },
    [balances],
  );

  useEffect(() => {
    if (!balancesLoading && balances) {
      setAssetsMeta(prev =>
        prev.map(asset => {
          const key = asset.key as keyof BalancesType;
          return {
            ...asset,
            balance: balances[key]?.toFixed(6) ?? '0.000000',
          };
        }),
      );
    }
  }, [balancesLoading, balances]);

  if (balancesLoading || !balances) {
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
                ? balances[asset.key as keyof BalancesType].toFixed(6).toString()
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
