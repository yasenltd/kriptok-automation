import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/theme/colors';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
import TextArea from '@components/ui/TextArea';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  seedPhrase: string;
  setSeedPhrase: Dispatch<SetStateAction<string>>;
  walletName: string;
  setWalletName: (value: string) => void;
  onNext: () => void;
};

const ImportSeedPhrase = ({
  seedPhrase,
  setSeedPhrase,
  walletName,
  setWalletName,
  onNext,
}: Props) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, width: '100%', gap: 30 }}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.warning,
            {
              backgroundColor: colors.grey[90],
              borderColor: colors.grey[70],
              boxShadow: 'inset 0px 0px 8px #99BBF5, inset 0px 0px 4px #FFFFFF40',
            },
          ]}
        >
          <View style={styles.warningRow}>
            <Image
              source={require('@assets/images/warning-icon.png')}
              style={{
                width: 40,
                height: 40,
                resizeMode: 'contain',
              }}
            />
            <Text
              style={[styles.text, { color: theme.text.primary, flexShrink: 1, flexWrap: 'wrap' }]}
            >
              {t('neverShare')}
            </Text>
          </View>
        </View>

        <View>
          <View>
            <Input
              value={walletName}
              onChange={setWalletName}
              width="screen"
              label={t('walletName')}
              placeholder={t('enterWallet')}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <TextArea
              value={seedPhrase}
              setValue={setSeedPhrase}
              placeholder={t('enterSeed')}
              label={t('importSeed')}
            />

            <Text
              style={[
                styles.text,
                { color: theme.text.tertiary, flexShrink: 1, flexWrap: 'wrap', marginTop: 10 },
              ]}
            >
              {t('seedWords')}
            </Text>
          </View>
        </View>

        <View>
          <Button
            label={t('continue')}
            size="screen"
            variant="secondary"
            disabled={!seedPhrase || !walletName}
            onPress={onNext}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
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
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
  },
  warning: {
    width: '100%',
    minHeight: 72,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  glow: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  warningRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
});

export default ImportSeedPhrase;
