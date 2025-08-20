import EnableBiometrics from '@/screens/create/EnableBiometrics';
import EnterPin from '@/screens/create/EnterPin';
import GenerateStep from '@/screens/create/GenerateStep';
import VerifyPin from '@/screens/create/VerifyPin';
import { useNavigation } from 'expo-router';
import { useLayoutEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';

const Generate = () => {
  const [step, setStep] = useState(0);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: step === 3 ? () => null : undefined,
      gestureEnabled: step !== 3,
    });
  }, [navigation, step]);
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
        <Animated.View style={{ flex: 1 }} entering={FadeInRight} exiting={FadeOutLeft}>
          <GenerateStep pin={pin} biometricsEnabled={biometricsEnabled} />
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

export default Generate;
