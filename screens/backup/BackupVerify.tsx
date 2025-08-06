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
        {randomWordsToCheck.map((item: any, index: number) => (
          <View key={`${item.word}-${index}`} style={styles.wordBox}>
            <Text style={styles.wordIndex}>{item.index + 1}.</Text>
            <TextInput
              style={[styles.wordText, { width: '100%' }]}
              value={userInputs[index]}
              onChangeText={text => {
                const newInputs = [...userInputs];
                newInputs[index] = text.trim().toLowerCase();
                setUserInputs(newInputs);
              }}
            />
          </View>
        ))}
      </View>

      <Button onPress={handleVerify}>
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
