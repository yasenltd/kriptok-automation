import { View } from 'react-native';
import UnlockModal from '@components/UnlockModal';
import { useBackup } from '@/hooks/useBackup';
import BackupStepIntro from '@/screens/backup/BackupIntro';
import BackupStepShowPhrase from '@/screens/backup/BackupShowPhrase';
import BackupStepVerify from '@/screens/backup/BackupVerify';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

export default function Backup() {
  const {
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
  } = useBackup();

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {showPinModal && !mnemonic && (
        <UnlockModal
          modalVisible={showPinModal}
          setModalVisible={setShowPinModal}
          pin={pin}
          setPin={setPin}
          handleUnlock={() => getMnemonicWithPin(pin)}
          text="Enter your PIN to reveal your secret phrase"
          buttonText="Continue"
        />
      )}

      {mnemonic && step === 0 && (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
          <BackupStepIntro setStep={setStep} />
        </Animated.View>
      )}

      {mnemonic && step === 1 && (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
          <BackupStepShowPhrase
            mnemonic={mnemonic}
            hideMnemonic={hideMnemonic}
            setHideMnemonic={setHideMnemonic}
            checkmark={checkmark}
            setCheckmark={setCheckmark}
            setStep={setStep}
          />
        </Animated.View>
      )}

      {mnemonic && step === 2 && (
        <Animated.View entering={FadeInRight} exiting={FadeOutLeft}>
          <BackupStepVerify
            randomWordsToCheck={randomWordsToCheck}
            userInputs={userInputs}
            setUserInputs={setUserInputs}
            handleVerify={handleVerify}
          />
        </Animated.View>
      )}
    </View>
  );
}
