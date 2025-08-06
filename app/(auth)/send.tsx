import { BalancesType, useAllBalances } from '@/hooks/useGetBalances';
import { RootState } from '@/stores/store';
import AppLoader from '@components/ui/AppLoader';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { useHeaderHeight } from '@react-navigation/elements';
import AppInput from '@components/ui/AppInput';
import { useMemo, useState } from 'react';
import CryptoIcon from '@ledgerhq/crypto-icons/native';

type AssetKey = keyof BalancesType;

const assetsMeta: { key: AssetKey; label: string; ledgerId: string }[] = [
  { key: 'eth', label: 'ETH', ledgerId: 'ethereum' },
  { key: 'btc', label: 'BTC', ledgerId: 'bitcoin' },
  { key: 'sol', label: 'SOL', ledgerId: 'solana' },
  { key: 'sui', label: 'SUI', ledgerId: 'sui' },
];
const Send = () => {
  const user = useSelector((state: RootState) => state.user.data);
  const { balances, balancesLoading } = useAllBalances({
    eth: user?.address ?? '',
    btc: user?.btc ?? '',
    sol: user?.solana ?? '',
    sui: user?.sui ?? '',
  });
  const headerHeight = useHeaderHeight();

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

  if (balancesLoading) {
    return (
      <View style={{ flex: 1, marginBottom: headerHeight }}>
        <AppLoader />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
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
          <View style={styles.assetRow}>
            <View style={styles.assetLeft}>
              <CryptoIcon ticker={asset.label} ledgerId={asset.ledgerId} size={20} />
              <Text style={styles.assetLabel}>{asset.label}</Text>
            </View>

            <Text style={styles.assetBalance}>
              {typeof balances[asset.key] === 'number' ? balances[asset.key].toFixed(6) : '0.0000'}
            </Text>
          </View>
        )}
      />
    </View>
  );
};
export default Send;

const styles = StyleSheet.create({
  assetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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
