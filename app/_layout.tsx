import { AuthProvider } from '@/context/AuthContext';
import { persistor, store } from '@/stores/store';
import { checkFirstInstallAndCleanup } from '@/utils/tracking';
import AppLoader from '@components/ui/AppLoader';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '../context/ThemeContext';
import ThemedStack from '@components/ThemedStack';

const Layout = () => {
  SplashScreen.preventAutoHideAsync();

  const [isLoaded, setIsLoaded] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    // add other font configurations here
    // should the font weights change
    'Satoshi-Regular': require('@/assets/fonts/Satoshi-Regular.otf'),
    'Satoshi-Bold': require('@/assets/fonts/Satoshi-Bold.otf'),
  });

  const checkForData = useCallback(async () => {
    await checkFirstInstallAndCleanup();
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  const onLayoutRootView = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await SplashScreen.hideAsync();
  }, []);

  useEffect(() => {
    checkForData();
  }, []);

  if (!isLoaded || !fontsLoaded) return <AppLoader />;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider>
            <AuthProvider>
              <ThemedStack />

              <Toast visibilityTime={5000} position="top" topOffset={60} />
            </AuthProvider>
          </ThemeProvider>
        </PersistGate>
      </Provider>
    </View>
  );
};

export default Layout;
