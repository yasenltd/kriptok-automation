import { Stack } from 'expo-router';
import { Buffer } from 'buffer';
import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';
import { Provider } from 'react-redux';
import { store, persistor } from '@/stores/store';
import { PersistGate } from 'redux-persist/integration/react';

const Layout = () => {
  if (global.Buffer == null) {
    global.Buffer = Buffer;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="mnemonic"
            options={{
              headerShown: false,
            }}
          />
        </Stack>

        <Toast visibilityTime={5000} position="top" topOffset={60} />
      </PersistGate>
    </Provider>
  );
};

export default Layout;
