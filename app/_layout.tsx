import { AuthProvider } from '@/context/AuthContext';
import { persistor, store } from '@/stores/store';
import { colors } from '@/utils';
import { checkFirstInstallAndCleanup } from '@/utils/tracking';
import AppLoader from '@components/ui/AppLoader';
import { Header, HeaderBackButton } from '@react-navigation/elements';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, usePathname } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from '../context/ThemeContext';

// prevent the splash screen from auto-hiding
// when fonts are loading
SplashScreen.preventAutoHideAsync();

const Layout = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    // add other font configurations here
    // should the font weights change
    'Satoshi-Regular': require('@/assets/fonts/Satoshi-Regular.otf'),
    'Satoshi-Bold': require('@/assets/fonts/Satoshi-Bold.otf'),
  });

  const pathname = usePathname();

  const checkForData = useCallback(async () => {
    await checkFirstInstallAndCleanup();
    setIsLoaded(true);
  }, []);

  const showHeader = useMemo(() => {
    const headerRoutes = ['/', '/generate', '/import'];
    return headerRoutes.includes(pathname);
  }, [pathname]);

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    checkForData();
  }, []);

  if (!isLoaded || !fontsLoaded) return <AppLoader />;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider>
          <AuthProvider>
            <Stack
              screenOptions={{
                contentStyle: {
                  backgroundColor: colors['primary-white'],
                },
                headerShown: showHeader,
                header: props => (
                  <Header
                    {...props}
                    title={props.options.title as string}
                    headerTitleAlign="left"
                    headerBackButtonDisplayMode="minimal"
                    headerTransparent={true}
                    headerStyle={{ borderBottomWidth: 0, shadowOpacity: 0, elevation: 0 }}
                    headerLeft={headerProps =>
                      props.back && pathname !== '/home' ? (
                        <HeaderBackButton
                          {...headerProps}
                          onPress={props.navigation.goBack}
                          label={''}
                          tintColor={colors['text-black']}
                        />
                      ) : null
                    }
                  />
                ),
              }}
            >
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                }}
              />

              <Stack.Screen
                name="generate"
                options={{
                  headerShown: true,
                }}
              />

              <Stack.Screen
                name="import"
                options={{
                  headerShown: true,
                }}
              />
            </Stack>

            <Toast visibilityTime={5000} position="top" topOffset={60} />
          </AuthProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default Layout;
