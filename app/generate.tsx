import GenerateScreen from '@/screens/GenerateScreen';
import { SafeAreaView, StyleSheet } from 'react-native';

const Generate = () => {
  return (
    <SafeAreaView style={styles.root}>
      <GenerateScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    marginBottom: 60,
  },
});

export default Generate;
