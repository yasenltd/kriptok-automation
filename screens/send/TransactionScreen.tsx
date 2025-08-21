import { AssetMeta, txInfo } from '@/types';
import AppInput from '@components/ui/AppInput';
import UnlockModal from '@components/UnlockModal';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { useTransactionFlow } from '@/hooks/useTransactions';

type Props = {
  onComplete: (data: txInfo) => void;
};

const TransactionScreen = ({ onComplete }: Props) => {
  /* Hooks */
  const { token } = useLocalSearchParams();
  const parsedToken = JSON.parse(token as string) as AssetMeta;
  const {
    values,
    setValues,
    pin,
    setPin,
    showPinModal,
    setShowPinModal,
    confirmTransactionWithBiometrics,
    confirmTransactionWithPin,
  } = useTransactionFlow({ parsedToken, onComplete });

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
