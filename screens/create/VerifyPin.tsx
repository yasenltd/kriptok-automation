import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import PinInput from '@components/ui/AppPinInput';
import Button from '@components/ui/Button';
import { useMemo } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

type Props = {
  pin: string;
  onNext: () => void;
  confirmPin: string;
  setConfirmPin: (value: string) => void;
};

const VerifyPin = ({ pin, confirmPin, setConfirmPin, onNext }: Props) => {
  const { theme } = useTheme();

  const isWrong = useMemo(() => {
    if (confirmPin.length === 6 && confirmPin !== pin) {
      return true;
    }
    return false;
  }, [pin, confirmPin]);

  const isButtonDisabled = useMemo(() => {
    return !confirmPin || confirmPin.length < 6 || isWrong;
  }, [confirmPin, setConfirmPin, isWrong]);

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
            Re-enter PIN
          </Text>
          <PinInput
            length={6}
            value={confirmPin}
            onChange={setConfirmPin}
            autoFocus
            cellSize={42}
            isWrong={isWrong}
          />

          {isWrong && (
            <Text style={[styles.text, styles.title, { color: colors.error[40], marginTop: 10 }]}>
              This pin doesn't match the already entered one.
            </Text>
          )}

          <Text style={[styles.text, styles.title, { color: theme.text.tertiary, marginTop: 10 }]}>
            Be sure you enter the same PIN.
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

export default VerifyPin;

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
