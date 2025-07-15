import { Stack } from 'expo-router';
import { Buffer } from 'buffer';
import 'react-native-get-random-values';

const Layout = () => {
  if (global.Buffer == null) {
    global.Buffer = Buffer;
  }

  return (
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
  );
};

export default Layout;
