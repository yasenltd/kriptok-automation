import '@/utils/polyfills';
import { Stack, usePathname } from 'expo-router';
import { Header, HeaderBackButton } from '@react-navigation/elements';
import AuthGuard from '@/screens/AuthGuard';
import { useTheme } from '@/context/ThemeContext';

const AuthLayout = () => {
  const pathname = usePathname();
  const { theme } = useTheme();

  return (
    <AuthGuard>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor: theme.surface.primary,
          },
          header: props => (
            <Header
              {...props}
              title={props.options.title as string}
              headerTitleAlign="left"
              headerTransparent={true}
              headerStyle={{
                borderBottomWidth: 0,
                shadowOpacity: 0,
                elevation: 0,
              }}
              headerTitleStyle={{ color: theme.text.primary }}
              headerBackButtonDisplayMode="minimal"
              headerLeft={headerProps =>
                props.back && pathname !== '/home' ? (
                  <HeaderBackButton
                    {...headerProps}
                    onPress={props.navigation.goBack}
                    label={''}
                    tintColor={theme.text.primary}
                  />
                ) : null
              }
            />
          ),
        }}
      >
        <Stack.Screen
          name="home"
          options={{
            title: 'Home',
          }}
        />

        <Stack.Screen name="backup" />

        <Stack.Screen
          name="send/index"
          options={{
            title: 'Send',
          }}
        />

        <Stack.Screen
          name="send/transaction"
          options={{
            title: 'Send',
          }}
        />
      </Stack>
    </AuthGuard>
  );
};

export default AuthLayout;
