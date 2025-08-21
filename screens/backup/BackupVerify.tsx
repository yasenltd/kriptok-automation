import { UseBackupReturn } from '@/hooks/useBackup';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';

type Props = Pick<
  UseBackupReturn,
  'randomWordsToCheck' | 'userInputs' | 'setUserInputs' | 'handleVerify'
>;

const BackupStepVerify = ({
  randomWordsToCheck,
  userInputs,
  setUserInputs,
  handleVerify,
}: Props) => {
  return (
    <View>
      <Text>
        To protect your wallet, we need to confirm you've backed up your recovery phrase correctly.
        Please enter the correct words for a few positions.
      </Text>

      <View style={styles.mnemonicGrid}>
        <Text
          testID="seed-phrase-indexes"
          style={{ height: 0, width: 0, opacity: 0, position: 'absolute' }}
          accessible={false}
        >
          {randomWordsToCheck.map(i => i.index + 1).join(',')}
        </Text>
        {randomWordsToCheck.map((item: any, index: number) => (
          <View
            key={`${item.word}-${index}`}
            style={styles.wordBox}
            testID={`seed-verify-box-${item.index + 1}`}
          >
            <Text
              style={styles.wordIndex}
              testID={`seed-verify-label-${item.index + 1}`}
            >
              {item.index + 1}.
            </Text>
            <TextInput
              style={[styles.wordText, { width: '100%' }]}
              value={userInputs[index]}
              onChangeText={text => {
                const newInputs = [...userInputs];
                newInputs[index] = text.trim().toLowerCase();
                setUserInputs(newInputs);
              }}
              testID={`seed-verify-input-${item.index + 1}`}
            />
          </View>
        ))}
      </View>

      <Button testID='verify-seed-phrase' onPress={handleVerify}>
        <Text>Verify Seed Phrase</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default BackupStepVerify;
