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
              headerTransparent={true}
              headerStyle={{ borderBottomWidth: 0, shadowOpacity: 0, elevation: 0 }}
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
            gestureEnabled: false,
          }}
        />

        <Stack.Screen name="backup" />
      </Stack>
    </AuthGuard>
  );
};

export default AuthLayout;
