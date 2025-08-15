import EnterPin from '@/screens/create/EnterPin';
import GenerateScreen from '@/screens/GenerateScreen';
import { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

const Generate = () => {
  const [step, setStep] = useState(0);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  return (
    <SafeAreaView style={styles.root}>
      <EnterPin onNext={() => setStep(1)} pin={pin} setPin={setPin} />
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
