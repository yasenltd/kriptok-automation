import EnableBiometrics from '@/screens/components/EnableBiometrics';
import EnterPin from '@/screens/components/EnterPin';
import VerifyPin from '@/screens/components/VerifyPin';
import ImportSeedPhrase from '@/screens/import/ImportSeedPhrase';
import { useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

const Import = () => {
  const [step, setStep] = useState(0);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: step === 4 ? () => null : undefined,
      gestureEnabled: step !== 4,
    });
  }, [navigation, step]);

  if (true) {
    return <ImportSeedPhrase seedPhrase={seedPhrase} setSeedPhrase={setSeedPhrase} />;
  }
  return (
    <SafeAreaView style={styles.root}>
      {step === 0 && <EnterPin onNext={() => setStep(1)} pin={pin} setPin={setPin} />}
      {step === 1 && (
        <Animated.View style={{ flex: 1 }} entering={FadeInRight} exiting={FadeOutLeft}>
          <VerifyPin
            pin={pin}
            confirmPin={confirmPin}
            setConfirmPin={setConfirmPin}
            onNext={() => setStep(2)}
          />
        </Animated.View>
      )}

      {step === 2 && (
        <Animated.View style={{ flex: 1 }} entering={FadeInRight} exiting={FadeOutLeft}>
          <EnableBiometrics setBiometrics={setBiometricsEnabled} onNext={() => setStep(3)} />
        </Animated.View>
      )}

      {step === 3 && (
        <Animated.View
          style={{ flex: 1 }}
          entering={FadeInRight}
          exiting={FadeOutLeft}
        ></Animated.View>
      )}

      {step === 4 && (
        <Animated.View style={{ flex: 1 }} entering={FadeInRight} exiting={FadeOutLeft}>
          {/* <GenerateStep pin={pin} biometricsEnabled={biometricsEnabled} /> */}
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    marginBottom: 60,
  },
});

export default Import;
