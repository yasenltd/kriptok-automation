import TransactionCompleteScreen from '@/screens/send/TransactionCompleteScreen';
import TransactionScreen from '@/screens/send/TransactionScreen';
import { txInfo } from '@/types';
import { useCallback, useState } from 'react';
import { View } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

const Transaction = () => {
  const [step, setStep] = useState(0);
  const [txInfo, setTxInfo] = useState<txInfo | null>(null);

  const onTransactionComplete = useCallback((data: txInfo) => {
    setTxInfo(data);
    setStep(1);
  }, []);
  return (
    <View style={{ flex: 1, padding: 20 }}>
      {step === 0 && <TransactionScreen onComplete={onTransactionComplete} />}
      {step === 1 && txInfo !== null && (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
          <TransactionCompleteScreen data={txInfo} />
        </Animated.View>
      )}
    </View>
  );
};

export default Transaction;
