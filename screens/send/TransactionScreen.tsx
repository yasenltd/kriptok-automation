import { useToast } from '@/hooks/useToast';
import { RootState } from '@/stores/store';
import { AssetMeta } from '@/types';
import {
  deriveBitcoinWallet,
  deriveEVMWalletFromMnemonic,
  deriveSolanaWallet,
  deriveSuiWallet,
} from '@/utils';
import { loadWalletSecurely } from '@/utils/secureStore';
import { BaseTxParams, sendTransaction } from '@/utils/transactions';
import AppInput from '@components/ui/AppInput';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

const walletDerivationMap: Record<
  'bitcoin' | 'ethereum' | 'solana' | 'sui',
  (mnemonic: string) => { address: string; privateKey: string }
> = {
  bitcoin: deriveBitcoinWallet,
  ethereum: deriveEVMWalletFromMnemonic,
  solana: deriveSolanaWallet,
  sui: deriveSuiWallet,
};

const TransactionScreen = () => {
  /* Hooks */
  const { token } = useLocalSearchParams();
  const user = useSelector((state: RootState) => state.user.data);
  const parsedToken = JSON.parse(token as string) as AssetMeta;
  const toast = useToast();

  /* State */
  const [values, setValues] = useState({ to: '', amount: '', fee: '' });
  const [txHash, setTxHash] = useState('');

  const deriveWallet = useMemo(() => {
    return walletDerivationMap[parsedToken.ledgerId];
  }, [parsedToken]);

  /* Handlers */
  const getFromAddressByChain = useCallback(
    (chain: string): string => {
      const chainAddressMap: Record<string, string> = {
        bitcoin: user?.btc ?? '',
        solana: user?.solana ?? '',
        sui: user?.sui ?? '',
      };

      return chainAddressMap[chain] ?? '';
    },
    [user],
  );

  const buildTxParams = useCallback(
    (to: string, amount: string, fee?: string): BaseTxParams => {
      const baseParams: BaseTxParams = {
        to,
        amount,
        tokenAddress: parsedToken.isNative ? undefined : parsedToken.tokenAddress,
        decimals: parsedToken.decimals,
      };

      if (['bitcoin', 'sui', 'solana'].includes(parsedToken.ledgerId)) {
        baseParams.fromAddress = getFromAddressByChain(parsedToken.ledgerId);
      }

      if (parsedToken.ledgerId === 'bitcoin') {
        baseParams.fee = fee ?? '10';
      }

      return baseParams;
    },
    [parsedToken, getFromAddressByChain],
  );

  const handleTransaction = useCallback(async () => {
    const amountNum = parseFloat(values.amount);
    if (!values.amount || isNaN(amountNum) || amountNum <= 0) {
      toast.showError('Enter a valid amount!');
      return;
    }
    if (!values.to) {
      toast.showError('Enter a valid address!');
      return;
    }
    try {
      const mnemonic = await loadWalletSecurely();
      if (mnemonic) {
        const { privateKey } = deriveWallet(mnemonic);
        const txParams = buildTxParams(values.to, values.amount, values.fee);
        const txHash = await sendTransaction(parsedToken.ledgerId, txParams, privateKey);
        setTxHash(txHash);
      }
      toast.showSuccess('Transaction successful.');
    } catch (error) {
      toast.showError('Transaction failed. Please try again.');
      console.error(error);
    }
  }, [parsedToken, user, values]);

  return (
    <View>
      <View style={{ gap: 10 }}>
        <AppInput
          placeholder="Address"
          value={values.to}
          onChange={value =>
            setValues(prev => ({
              ...prev,
              to: value,
            }))
          }
          isPassword={false}
          size="screen"
        />

        <AppInput
          placeholder="Enter amount"
          value={values.amount}
          onChange={value =>
            setValues(prev => ({
              ...prev,
              amount: value,
            }))
          }
          isPassword={false}
          size="screen"
        />
      </View>
      <View style={{ alignItems: 'center', marginTop: 20 }}>
        <Pressable onPress={handleTransaction}>
          <Text>Confirm Transaction</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TransactionScreen;
