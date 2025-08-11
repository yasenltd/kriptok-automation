import { txInfo } from '@/types';
import { formatAddress } from '@/utils';
import { EXPLORER_URLS } from '@/utils/constants';
import { openExternalLink } from '@/utils/helpers';
import CryptoIcon from '@ledgerhq/crypto-icons/native';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  data: txInfo;
};

const openTxInExplorer = (assetLabel: string, txHash: string) => {
  const formatter = EXPLORER_URLS[assetLabel.toUpperCase()];
  if (!formatter) {
    console.warn(`No explorer URL for assetLabel: ${assetLabel}`);
    return;
  }
  openExternalLink(formatter(txHash));
};

const TransactionCompleteScreen = ({ data }: Props) => {
  const onClose = useCallback(() => {
    router.replace('/home');
  }, []);

  return (
    <View style={{ gap: 10, alignItems: 'center' }}>
      <Text>Your transaction was completed!</Text>
      <View style={styles.row}>
        <View
          style={{
            flexDirection: 'row',
            gap: 4,
          }}
        >
          <CryptoIcon ticker={data.assetLabel} ledgerId={data.icon} size={20} />
          <Text style={styles.textBlack}>{data.amount}</Text>
          <Text style={styles.textBlack}>{data.assetLabel}</Text>
        </View>

        <Text style={styles.textBlack}>to</Text>

        <Text style={styles.textBlack}>{formatAddress(data.to)}</Text>
      </View>

      <Pressable onPress={() => openTxInExplorer(data.assetLabel, data.txHash)}>
        <Text>View transaction on Etherscan</Text>
      </Pressable>

      <Pressable onPress={onClose}>
        <Text style={styles.textBlack}>Close</Text>
      </Pressable>
    </View>
  );
};

export default TransactionCompleteScreen;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  textBlack: {
    color: 'black',
  },
});
