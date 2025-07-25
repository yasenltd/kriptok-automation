import { router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import LanguageSelection from '@components/LanguageSelection';
import AuthGuard from '@/screens/AuthGuard';

const WelcomeScreen = () => {
  const { t } = useTranslation();
  return (
    <AuthGuard>
      <SafeAreaView style={styles.container}>
        <LanguageSelection />
        <Text style={styles.title}>{t('kriptokWallet')}</Text>
        <Text style={styles.subtitle}>{t('welcome')}</Text>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push('/generate')}
        >
          <Text style={styles.buttonText}>{t('create')}</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => router.push('/import')}
        >
          <Text style={styles.buttonText}>{t('import')}</Text>
        </Pressable>
      </SafeAreaView>
    </AuthGuard>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
    width: '80%',
  },
  buttonPressed: {
    backgroundColor: '#4338ca',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
