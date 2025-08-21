import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';

import { useToast } from '@/hooks/useToast';
import { RootState } from '@/stores/store';
import { AssetMeta, txInfo } from '@/types';
import { BaseTxParams, sendTransaction } from '@/utils/transactions';
import { estimateGasFee } from '@/utils/transactions/evm';
import { loadPrivkeyFromPin, loadPrivKeyWithBiometrics } from '@/utils/secureStore';

export type Values = { to: string; amount: string; fee?: string };
export type Fail = { message: string };

export const validateTx = (values: Values): Fail | null => {
  const amountNum = Number(values.amount);

  const rules: Array<[boolean, string]> = [
    [!!values.amount && !isNaN(amountNum) && amountNum > 0, 'Enter a valid amount!'],
    [!!values.to, 'Enter a valid address!'],
  ];

  const failed = rules.find(([ok]) => !ok);
  return failed ? { message: failed[1] } : null;
};

export const CHAIN_TO_BAL_KEY = {
  ethereum: 'eth',
  polygon: 'polygon',
  bsc: 'bnb',
} as const;

export const CHAIN_TO_NATIVE_SYMBOL = {
  ethereum: 'ETH',
  polygon: 'MATIC',
  bsc: 'BNB',
} as const;

export const getNativeFromStore = (
  user: RootState['user']['data'],
  chain: 'ethereum' | 'polygon' | 'bsc',
): string | null => {
  const key = CHAIN_TO_BAL_KEY[chain];
  const native = user?.balances?.[key as keyof typeof user.balances]?.native;
  return typeof native === 'string' ? native : null;
};

export const LEDGER_TO_KEYTYPE = {
  bitcoin: 'btc',
  ethereum: 'eth',
  solana: 'sol',
  sui: 'sui',
  polygon: 'eth',
  bsc: 'eth',
} as const;

type LedgerId = keyof typeof LEDGER_TO_KEYTYPE;

type Args = {
  parsedToken: AssetMeta;
  onComplete: (data: txInfo) => void;
};

export const useTransactionFlow = ({ parsedToken, onComplete }: Args) => {
  const toast = useToast();
  const user = useSelector((state: RootState) => state.user.data);

  const [values, setValues] = useState<Values>({ to: '', amount: '', fee: '' });
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);

  const keyType = useMemo(() => {
    const ledger = parsedToken.ledgerId as LedgerId;
    const keyType = LEDGER_TO_KEYTYPE[ledger];
    return keyType;
  }, [parsedToken]);

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

  const ensureEvmBalancesWithFee = useCallback(
    async (privKey: string, txParams: BaseTxParams): Promise<boolean> => {
      const isEvm = ['ethereum', 'polygon', 'bsc'].includes(parsedToken.ledgerId);
      if (!isEvm || !txParams.chain) return true;

      const tokenAddress =
        txParams.tokenAddress ??
        (parsedToken.isNative ? ethers.ZeroAddress : parsedToken.tokenAddress);
      const decimals = txParams.decimals ?? parsedToken.decimals;

      const { feeInEth } = await estimateGasFee(
        tokenAddress ?? ethers.ZeroAddress,
        decimals,
        txParams,
        privKey,
        txParams.chain,
      );

      const nativeBalanceStr = getNativeFromStore(user, txParams.chain) ?? '0';

      const nativeBalNum = Number(nativeBalanceStr);
      const feeNum = Number(feeInEth);

      if (parsedToken.isNative) {
        const amountNum = Number(values.amount);
        if (!Number.isFinite(amountNum) || amountNum <= 0) return false;

        const ok = amountNum + feeNum <= nativeBalNum;
        if (!ok) {
          toast.showError(`Insufficient balance to cover amount and gas.`);
        }
        return ok;
      }

      const tokenBalanceNum = Number(parsedToken.balance ?? '0');
      const amountNum = Number(values.amount);

      const hasToken = Number.isFinite(amountNum) && amountNum <= tokenBalanceNum;
      const hasGas = feeNum <= nativeBalNum;

      if (!hasToken) {
        toast.showError(`Insufficient balance.`);
        return false;
      }
      if (!hasGas) {
        toast.showError(`Not enough balance for gas (~${feeInEth} required).`);
        return false;
      }
      return true;
    },
    [parsedToken, user, values.amount],
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

      if (['ethereum', 'polygon', 'bsc'].includes(parsedToken.ledgerId)) {
        baseParams.chain = parsedToken.ledgerId as 'ethereum' | 'polygon' | 'bsc';
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
      const fail = validateTx(values);
      if (fail) return failAndClose(fail.message);
      try {
        if (!privKey) {
          toast.showError('Private key not found for this chain.');
          return;
        }
        const txParams = buildTxParams(values.to, values.amount, values.fee);
        if (['ethereum', 'polygon', 'bsc'].includes(parsedToken.ledgerId)) {
          const ok = await ensureEvmBalancesWithFee(privKey, txParams);
          if (!ok) return;
        }
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
    [parsedToken, values, onComplete, buildTxParams, ensureEvmBalancesWithFee, failAndClose],
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

  return {
    values,
    setValues,
    pin,
    setPin,
    showPinModal,
    setShowPinModal,

    confirmTransactionWithBiometrics,
    confirmTransactionWithPin,

    validateTx,
    buildTxParams,
    ensureEvmBalancesWithFee,
  };
};
