import { Stack } from 'expo-router';
import { Buffer } from 'buffer';
import 'react-native-get-random-values';
import Toast from 'react-native-toast-message';

const Layout = () => {
  if (global.Buffer == null) {
    global.Buffer = Buffer;
  }

  return (
    <>
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
      </Stack>
      <Toast visibilityTime={5000} position="top" topOffset={60} />
    </>
  );
};

export default Layout;
