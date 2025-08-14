import { useToast } from '@/hooks/useToast';
import { updateUser } from '@/stores/user/userSlice';
import { loadWalletSecurelyWithBiometrics } from '@/utils';
import { loadWalletFromPin } from '@/utils/secureStore';
import { updateHasBackedUp } from '@/utils/users';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

const getRandomMnemonicWords = (
  words: string[],
  count: number = 3,
): { index: number; word: string }[] => {
  const wordIndices = words.map((_, index) => index);

  const shuffled = wordIndices
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .sort((a, b) => a - b);

  return shuffled.map(index => ({ index, word: words[index] }));
};

export type UseBackupReturn = ReturnType<typeof useBackup>;

export const useBackup = () => {
  const toast = useToast();
  const dispatch = useDispatch();

  const [step, setStep] = useState(0);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [hideMnemonic, setHideMnemonic] = useState(true);
  const [checkmark, setCheckmark] = useState(false);
  const [randomWordsToCheck, setRandomWordsToCheck] = useState<{ index: number; word: string }[]>(
    [],
  );
  const [userInputs, setUserInputs] = useState<string[]>(['', '', '']);

  const getMnemonicWithBiometrics = useCallback(async () => {
    const mnemonic = await loadWalletSecurelyWithBiometrics();
    if (mnemonic) {
      setMnemonic(mnemonic);
      return;
    }
    setShowPinModal(true);
  }, []);

  const getMnemonicWithPin = useCallback(async (input: string) => {
    const mnemonic = await loadWalletFromPin(input);
    if (!mnemonic) {
      toast.showError('Wrong pin. Try again.');
      return;
    }
    setMnemonic(mnemonic);
    setShowPinModal(false);
  }, []);

  const handleVerify = useCallback(async () => {
    const words = mnemonic?.trim().split(' ') ?? [];

    const isCorrect = randomWordsToCheck.every((item, i) => {
      return words[item.index].toLowerCase() === userInputs[i];
    });

    if (isCorrect) {
      try {
        const hasBackedUp = await updateHasBackedUp();
        dispatch(updateUser({ hasBackedUp: hasBackedUp }));
      } catch (error) {
        console.error(error);
        toast.showError('❌ Please, try again later.');
        return;
      }
      toast.showSuccess('✅ Seed phrase verified!');

      setMnemonic(null);
      router.replace('/home');
    } else {
      toast.showError('❌ One or more words are incorrect. Try again.');
    }
  }, [mnemonic, randomWordsToCheck, userInputs]);

  useEffect(() => {
    getMnemonicWithBiometrics();
  }, []);

  useEffect(() => {
    if (mnemonic && step === 2) {
      const randomWords = getRandomMnemonicWords(mnemonic.trim().split(' '));
      setRandomWordsToCheck(randomWords);
      setUserInputs(['', '', '']);
    }
  }, [mnemonic, step]);

  return {
    step,
    setStep,
    mnemonic,
    pin,
    setPin,
    showPinModal,
    setShowPinModal,
    hideMnemonic,
    setHideMnemonic,
    checkmark,
    setCheckmark,
    randomWordsToCheck,
    userInputs,
    setUserInputs,
    getMnemonicWithPin,
    handleVerify,
  };
};
