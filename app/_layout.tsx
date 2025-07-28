import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store, persistor } from '@/stores/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Header, HeaderBackButton } from '@react-navigation/elements';
import { colors } from '@/utils';
import { AuthProvider } from '@/context/AuthContext';

const Layout = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <Stack
            screenOptions={{
              contentStyle: {
                backgroundColor: colors['primary-white'],
              },
              header: props => (
                <Header
                  {...props}
                  title={props.options.title as string}
                  headerTitleAlign="left"
                  headerBackButtonDisplayMode="minimal"
                  headerLeft={headerProps =>
                    props.back ? (
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
