import '@/utils/polyfills';
import { Stack, usePathname } from 'expo-router';
import { Header, HeaderBackButton } from '@react-navigation/elements';
import { colors } from '@/utils';
import AuthGuard from '@/screens/AuthGuard';
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';
import { useMemo } from 'react';
import { useBalancePollingAll } from '@/hooks/useBalancePolling';

const AuthLayout = () => {
  const pathname = usePathname();
  const user = useSelector((s: RootState) => s.user.data);
  const addresses = useMemo(
    () => ({
      eth: user?.address,
      btc: user?.btc,
      sol: user?.solana,
      sui: user?.sui,
    }),
    [user?.address, user?.btc, user?.solana, user?.sui],
  );

  //useBalancePollingAll(addresses);

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
