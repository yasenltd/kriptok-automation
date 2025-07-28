import '@/utils/polyfills';
import { Stack } from 'expo-router';
import { Header, HeaderBackButton } from '@react-navigation/elements';
import { colors } from '@/utils';
import AuthGuard from '@/screens/AuthGuard';

const AuthLayout = () => {
  return (
    <AuthGuard>
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
          name="home"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AuthGuard>
  );
};

export default AuthLayout;
