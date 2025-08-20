import { useTheme } from '@/context/ThemeContext';
import { typography } from '@/theme/typography';
import PinInput from '@components/ui/AppPinInput';
import Button from '@components/ui/Button';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

type Props = {
  onNext: () => void;
  pin: string;
  setPin: (value: string) => void;
};

const EnterPin = ({ onNext, pin, setPin }: Props) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const isButtonDisabled = useMemo(() => {
    return !pin || pin.trim().length < 6;
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
            {t('enterPin')}
          </Text>
          <PinInput length={6} value={pin} onChange={setPin} autoFocus cellSize={42} />

          <Text style={[styles.text, styles.title, { color: theme.text.tertiary, marginTop: 5 }]}>
            {t('secureYourWallet')}
          </Text>

          <Text style={[styles.text, styles.title, { color: theme.text.tertiary }]}>
            {t('pleaseRemember')}
          </Text>
        </View>

        <Button
          label={t('continue')}
          variant="secondary"
          size={'screen'}
          onPress={onNext}
          disabled={isButtonDisabled}
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
