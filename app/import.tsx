import ImportScreen from '@/screens/ImportScreen';
import { SafeAreaView, StyleSheet } from 'react-native';

const Import = () => {
  return (
    <SafeAreaView style={styles.root}>
      <ImportScreen />
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

export default Import;
