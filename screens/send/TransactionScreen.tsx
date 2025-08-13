import { useToast } from '@/hooks/useToast';
import { RootState } from '@/stores/store';
import { AssetMeta, txInfo } from '@/types';
import { loadPrivkeyFromPin, loadPrivKeyWithBiometrics } from '@/utils/secureStore';
import { BaseTxParams, sendTransaction } from '@/utils/transactions';
import AppInput from '@components/ui/AppInput';
import UnlockModal from '@components/UnlockModal';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';

type Values = { to: string; amount: string; fee?: string };
type Fail = { message: string };

const validateTx = (values: Values, balanceStr?: string): Fail | null => {
  const amountNum = Number(values.amount);
  const balanceNum = Number(balanceStr ?? '0');

  const rules: Array<[boolean, string]> = [
    [!!values.amount && !isNaN(amountNum) && amountNum > 0, 'Enter a valid amount!'],
    [amountNum <= balanceNum, 'Insufficient balance!'],
    [!!values.to, 'Enter a valid address!'],
  ];

  const failed = rules.find(([ok]) => !ok);
  return failed ? { message: failed[1] } : null;
};

const LEDGER_TO_KEYTYPE = {
  bitcoin: 'btc',
  ethereum: 'eth',
  solana: 'sol',
  sui: 'sui',
} as const;

type LedgerId = keyof typeof LEDGER_TO_KEYTYPE;

type Props = {
  onComplete: (data: txInfo) => void;
};

const TransactionScreen = ({ onComplete }: Props) => {
  /* Hooks */
  const { token } = useLocalSearchParams();
  const user = useSelector((state: RootState) => state.user.data);
  const parsedToken = JSON.parse(token as string) as AssetMeta;
  const toast = useToast();

  /* State */
  const [values, setValues] = useState({ to: '', amount: '', fee: '' });
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);

  /* Memo */
  const keyType = useMemo(() => {
    const ledger = parsedToken.ledgerId as LedgerId;
    const keyType = LEDGER_TO_KEYTYPE[ledger];
    return keyType;
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

  const failAndClose = useCallback((msg: string) => {
    toast.showError(msg);
    setShowPinModal(false);
    setPin('');
  }, []);

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

  const handleTransaction = useCallback(
    async (privKey: string) => {
      const fail = validateTx(values, parsedToken.balance);
      if (fail) return failAndClose(fail.message);
      try {
        if (!privKey) {
          toast.showError('Private key not found for this chain.');
          return;
        }
        const txParams = buildTxParams(values.to, values.amount, values.fee); //TODO : TRANSACTION FEE
        const txHash = await sendTransaction(parsedToken.ledgerId, txParams, privKey);
        onComplete({
          amount: values.amount,
          txHash: txHash,
          to: values.to,
          icon: parsedToken.ledgerId,
          assetLabel: parsedToken.label,
        });
      } catch (error) {
        toast.showError('Transaction failed. Please try again.');
        console.error(error);
      } finally {
        setShowPinModal(false);
        setPin('');
      }
    },
    [parsedToken, user, values, onComplete],
  );

  const confirmTransactionWithBiometrics = useCallback(async () => {
    const privateKey = await loadPrivKeyWithBiometrics(keyType);
    if (!privateKey) {
      setShowPinModal(true);
      return;
    }
    await handleTransaction(privateKey);
  }, [handleTransaction, keyType]);

  const confirmTransactionWithPin = useCallback(
    async (input: string) => {
      const privKey = await loadPrivkeyFromPin(input, keyType);
      if (!privKey) {
        toast.showError('Wrong pin. Try again.');
        return;
      }
      await handleTransaction(privKey);
    },
    [keyType, handleTransaction],
  );

  return (
    <View>
      {showPinModal && (
        <UnlockModal
          modalVisible={showPinModal}
          setModalVisible={setShowPinModal}
          pin={pin}
          setPin={setPin}
          handleUnlock={() => confirmTransactionWithPin(pin)}
          text="Enter your PIN to complete transaction"
          buttonText="Continue"
        />
      )}
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
        <Pressable onPress={confirmTransactionWithBiometrics}>
          <Text>Confirm Transaction</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default TransactionScreen;
