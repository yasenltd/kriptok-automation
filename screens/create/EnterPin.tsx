import { useTheme } from '@/context/ThemeContext';
import { typography } from '@/theme/typography';
import PinInput from '@components/ui/AppPinInput';
import Button from '@components/ui/Button';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { useMemo } from 'react';

type Props = {
  onNext: () => void;
  pin: string;
  setPin: (value: string) => void;
};

const EnterPin = ({ onNext, pin, setPin }: Props) => {
  const { theme } = useTheme();

  const isButtonDisabled = useMemo(() => {
    return !pin || pin.length < 6;
  }, [pin, setPin]);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1, justifyContent: 'space-between', marginVertical: 150 }}>
        <View>
          <Text
            style={[
              typography['heading5'],
              styles.title,
              { color: theme.text.primary, marginBottom: 50 },
            ]}
          >
            Enter PIN
          </Text>
          <PinInput length={6} value={pin} onChange={setPin} autoFocus cellSize={42} />

          <Text style={[styles.text, styles.title, { color: theme.text.tertiary }]}>
            This is used to secure your wallet on this device.
          </Text>

          <Text style={[styles.text, styles.title, { color: theme.text.tertiary }]}>
            Please remember it, as it cannot be recovered.
          </Text>
        </View>

        <Button
          label="Continue"
          style="secondary"
          size={'screen'}
          onPress={onNext}
          state={isButtonDisabled ? 'disabled' : 'default'}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

export default EnterPin;

const styles = StyleSheet.create({
  text: {
    textAlign: 'center',
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
  },
  title: {
    textAlign: 'center',
  },
});
