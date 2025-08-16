import { useTheme } from '@/context/ThemeContext';
import { typography } from '@/theme/typography';
import { Linking, Platform, StyleSheet, Text, View } from 'react-native';
import Finger from '@assets/images/finger-icon.svg';
import Smile from '@assets/images/smile-icon.svg';
import Button from '@components/ui/Button';
import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback } from 'react';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from 'react-i18next';

type Props = {
  onNext: () => void;
  setBiometrics: (state: boolean) => void;
};

const EnableBiometrics = ({ onNext, setBiometrics }: Props) => {
  const { theme } = useTheme();
  const toast = useToast();
  const { t } = useTranslation();

  const handleEnable = useCallback(async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        toast.showError('This device does not support biometrics');
        return;
      }

      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Linking.openSettings();
        return;
      }

      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      const usesFace =
        types?.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) ?? false;
      const methodLabel =
        Platform.OS === 'ios' ? (usesFace ? 'Face ID' : 'Touch ID') : 'biometrics';

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Enable ${methodLabel}`,
        fallbackLabel: 'Use Passcode',
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (!result.success) {
        toast.showError('Can not set up biometrics. Please use PIN.');
        return;
      }

      setBiometrics(true);

      onNext();
    } catch (err) {
      console.error(err);
      toast.showError('Try again.');
    }
  }, [onNext, setBiometrics]);
  return (
    <View style={styles.root}>
      <View>
        <Text style={[typography['heading5'], styles.title, { color: theme.text.primary }]}>
          {t('loginWith')} {Platform.OS === 'ios' ? 'Face ID' : 'Touch ID'}
        </Text>

        <Text
          style={[
            styles.text,
            styles.title,
            { color: theme.text.tertiary, marginTop: 10, alignSelf: 'stretch' },
          ]}
        >
          {t('makeLogging')}
        </Text>

        <View style={{ alignItems: 'center', marginTop: 30 }}>
          {Platform.OS === 'ios' ? (
            <Smile width={120} height={120} />
          ) : (
            <Finger width={120} height={120} />
          )}
        </View>
      </View>

      <View style={styles.rowButtons}>
        <Button label={t('skip')} style="tertiary" size={'L'} onPress={onNext} />

        <Button label={t('enable')} style="secondary" size={'L'} onPress={handleEnable} />
      </View>
    </View>
  );
};

export default EnableBiometrics;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
    marginVertical: 150,
  },
  rowButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
  },
});
