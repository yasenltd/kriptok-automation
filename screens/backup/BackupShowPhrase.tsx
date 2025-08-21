import SeedPhrase from '@/components/ui/SeedPhrase';
import { UseBackupReturn } from '@/hooks/useBackup';
import { useToast } from '@/hooks/useToast';
import { copyToClipboard } from '@/utils';
import AppCheckbox from '@components/ui/AppCheckbox';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

type Props = Pick<
  UseBackupReturn,
  'mnemonic' | 'hideMnemonic' | 'setHideMnemonic' | 'checkmark' | 'setCheckmark' | 'setStep'
>;

const BackupStepShowPhrase = ({
  mnemonic,
  hideMnemonic,
  setHideMnemonic,
  checkmark,
  setCheckmark,
  setStep,
}: Props) => {
  const toast = useToast();
  const handleCopy = useCallback(
    (text: string) => {
      copyToClipboard(text);
      toast.showSuccess('Mnemonic copied!');
    },
    [mnemonic],
  );
  return (
    <View>
      {mnemonic && (
        <>
          {/* This line is for Detox tests only! */}
          {__DEV__ && (
            <Text
              testID="seed-phrase"
              style={{ opacity: 0, position: 'absolute', height: 0, width: 0 }}
              accessible={false}
            >
              {mnemonic}
            </Text>
          )}
          <Text>
            The seed phrase is used to access your wallet. Write it down, preferably offline and
            keep it somewhere safe.
          </Text>

          <SeedPhrase
            mnemonic={mnemonic}
            hideMnemonic={hideMnemonic}
            setHideMnemonic={setHideMnemonic}
          />

          <View style={styles.checkboxRow}>
            <AppCheckbox
              testID='check-backed-seed'
              color="black"
              value={checkmark}
              onChange={() => setCheckmark(!checkmark)}
            />
          </View>

          <Button testID='confirm' onPress={() => setStep(2)} disabled={!checkmark}>
            <Text>Confirm</Text>
          </Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textContainer: { backgroundColor: '#414542', borderRadius: 8, padding: 8 },
  controls: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  mnemonicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  wordBox: {
    width: '32%',
    marginBottom: 12,
    backgroundColor: '#2d2f2c',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  wordIndex: { color: '#E4E1E1', marginRight: 6 },
  wordText: { color: 'white', fontWeight: 'bold' },
  checkboxRow: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
  },
});

export default BackupStepShowPhrase;
