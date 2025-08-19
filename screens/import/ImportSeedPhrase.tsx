import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/theme/colors';
import Button from '@components/ui/Button';
import Input from '@components/ui/Input';
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
  setSeedPhrase: (value: string) => void;
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
              Never share your seed phrase with anyone. Anyone who has it can access and steal your
              funds immediately.
            </Text>
          </View>
        </View>

        <View>
          <View>
            <Input
              value={walletName}
              onChange={setWalletName}
              size="normal"
              width="screen"
              label="Wallet Name"
              placeholder="Enter wallet name"
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <Input
              value={seedPhrase}
              onChange={setSeedPhrase}
              size="normal"
              width="screen"
              label="Import Seed Phrase"
              placeholder="Enter seed phrase"
            />

            <Text
              style={[
                styles.text,
                { color: theme.text.tertiary, flexShrink: 1, flexWrap: 'wrap', marginTop: 10 },
              ]}
            >
              Typically 12 (sometimes 18,24) words separated by single spaces
            </Text>
          </View>
        </View>

        <View>
          <Button
            label="Continue"
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
