import Input from '@/components/ui/Input';
import Link from '@/components/ui/Link';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/useToast';
import { copyToClipboard } from '@/utils';
import { useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ClipboardIcon as CopyIcon, EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';

interface SeedPhraseProps {
  mnemonic: string;
  hideMnemonic: boolean;
  setHideMnemonic: (value: boolean) => void;
}

const SeedPhrase: React.FC<SeedPhraseProps> = ({
  mnemonic,
  hideMnemonic,
  setHideMnemonic,
}: SeedPhraseProps) => {
  const toast = useToast();
  const handleCopy = useCallback(
    (text: string) => {
      copyToClipboard(text);
      toast.showSuccess('Mnemonic copied!');
    },
    [mnemonic],
  );
  const { styles } = useSeedPhraseStyles();

  return (
    <View
      style={[
        styles.textContainer,
        { borderWidth: 1, borderColor: 'gray', width: '100%', minHeight: 270 },
      ]}
    >
      <View style={styles.controls}>
        <Link
          label={hideMnemonic ? 'Show seed phrase' : 'Hide seed phrase'}
          variant="secondary"
          onPress={() => setHideMnemonic(!hideMnemonic)}
          icon={hideMnemonic ? <EyeIcon /> : <EyeSlashIcon />}
          showLeftIcon={true}
          testID={hideMnemonic ? 'reveal-seed' : undefined}
        />

        <Link
          label="Copy"
          variant="secondary"
          onPress={() => handleCopy(mnemonic)}
          icon={<CopyIcon />}
          showLeftIcon={true}
        />
      </View>

      {hideMnemonic && (
        <View style={styles.hideContainer}>
          <EyeSlashIcon size={20} color={styles.hideContainerIcon.color}></EyeSlashIcon>
        </View>
      )}

      {!hideMnemonic && (
        <View style={styles.mnemonicGrid}>
          {mnemonic.split(' ').map((word: string, index: number) => (
            <View key={index} style={styles.wordBox}>
              <Text style={styles.wordIndex}>{index + 1}.</Text>
              <Input value={word} setValue={() => {}} width={'screen'} style={{ flex: 1 }} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const useSeedPhraseStyles = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => {
    return StyleSheet.create({
      hideContainer: {
        flex: 1,
        width: '100%',
        minHeight: 180,
        flexDirection: 'row',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.surface.secondary,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: theme.stroke.primary,
      },
      hideContainerIcon: {
        color: theme.icons.tertiary,
      },
      textContainer: {
        flexDirection: 'column',
        borderRadius: 12,
        gap: 24,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 24,
      },
      controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
      mnemonicGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 6,
      },
      wordBox: {
        width: '32%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
      },
      wordIndex: {
        color: '#E4E1E1',
        fontSize: 14,
        fontFamily: 'Satoshi-Regular',
        fontWeight: 400,
        lineHeight: 20,
        width: 20,
      },
      wordText: { color: 'white', fontWeight: 'bold' },
      checkboxRow: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 3,
      },
    });
  }, []);
  return { styles };
};

export default SeedPhrase;
