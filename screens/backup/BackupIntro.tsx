import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';

const BackupStepIntro = ({ setStep }: { setStep: (n: number) => void }) => {
  return (
    <View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>This is your Secret Recovery Phrase</Text>
        <Text style={styles.text}>
          Anyone who has this phrase can take full control of your wallet and steal your funds.
        </Text>

        <Text style={styles.warning}>
          You are the only one who can access your wallet. If you lose this phrase, we cannot help
          you recover your funds.
        </Text>
      </View>

      <Button onPress={() => setStep(1)}>
        <Text>I understand the risks</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  text: { color: 'white' },
  warning: { color: '#F67979' },
  textContainer: { backgroundColor: '#414542', borderRadius: 8, padding: 8 },
});

export default BackupStepIntro;
