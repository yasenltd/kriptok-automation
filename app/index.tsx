import LanguageSelectionScreen from '@/screens/LanguageSelection';
import { RootState } from '@/stores/store';
import { Redirect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const Home = () => {
  const hasLanguage = useSelector((state: RootState) => state.language.hasBeenSet);

  if (hasLanguage) {
    return <Redirect href="/mnemonic" />;
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LanguageSelectionScreen />
    </SafeAreaView>
  );
};

export default Home;
