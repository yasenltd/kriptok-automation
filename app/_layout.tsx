import { Stack, usePathname } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store, persistor } from '@/stores/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Header, HeaderBackButton } from '@react-navigation/elements';
import { colors } from '@/utils';
import { AuthProvider } from '@/context/AuthContext';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { checkFirstInstallAndCleanup } from '@/utils/tracking';
import AppLoader from '@components/ui/AppLoader';
import { SafeAreaView } from 'react-native-safe-area-context';

const Layout = () => {
  const [isLoaded, setIsLoaded] = useState(false);

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
    checkForData();
  }, []);

  if (!isLoaded) return <AppLoader />;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </Provider>
  );
};

export default Layout;
