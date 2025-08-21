import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/useToast';
import { api, refreshInstance } from '@/services/apiClient';
import { RootState } from '@/stores/store';
import { AuthLogoutResponse, AuthRefreshResponse } from '@/types';
import { deriveEVMWalletFromMnemonic, shareText } from '@/utils';
import { getLoginMessage, login, signSiweMessage } from '@/utils/auth';
import { loadWalletSecurely } from '@/utils/secureStore';
import { getToken, saveToken } from '@/utils/tokenStorage';
import WalletQr from '@components/WalletQr';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

// NOTE: Intended for initial testing and development purposes, to be removed later
const Home = () => {
  /* Hooks */
  const user = useSelector((state: RootState) => state.user.data);
  const toast = useToast();
  const { theme } = useTheme();

  const [evmWallet, setEvmWallet] = useState<{ address: string; privateKey: string } | null>(null);
  const handleLogin = async () => {
    if (!evmWallet) return;
    const { message } = await getLoginMessage(evmWallet.address);
    const loginSignature = await signSiweMessage(message, evmWallet.privateKey);
    const { access_token, expires_in, refresh_token, refresh_expires_in } = await login(
      message,
      loginSignature,
    );
    console.log('access_token', access_token);
    await saveToken({
      access_token,
      refresh_token,
      expires_in: expires_in.toString(),
      refresh_expires_in: refresh_expires_in.toString(),
    });
  };
  const handleRefresh = async () => {
    const savedTokenData: Record<string, any> | null = await getToken();
    if (!savedTokenData) return null;

    const response = await refreshInstance.post<AuthRefreshResponse>(
      '/auth/refresh',
      {},
      {
        headers: {
          Authorization: `Bearer ${savedTokenData.refresh_token}`,
        },
      },
    );

    const { access_token, expires_in, refresh_token, refresh_expires_in } = response.data;
    console.log('access_token', access_token);
    const expirationTimestamp = Date.now() + (expires_in - 30) * 1000;
    const refreshExpirationTimestamp = Date.now() + (refresh_expires_in - 30) * 1000;
    const tokenData = {
      access_token,
      refresh_token,
      expires_in: expirationTimestamp.toString(),
      refresh_expires_in: refreshExpirationTimestamp.toString(),
    };
    await saveToken(tokenData);
  };
  const handleLogout = async () => {
    const savedTokenData: Record<string, any> | null = await getToken();
    if (!savedTokenData) return null;
    const response = await api.post<AuthLogoutResponse>('/auth/logout', {
      headers: {
        Authorization: `Bearer ${savedTokenData.access_token}`,
      },
    });
    console.log('response logout', response.data);
  };
  const handleTestAccessToken = async () => {
    const savedTokenData: Record<string, any> | null = await getToken();
    if (!savedTokenData) return null;
    const response = await api.post<any>(
      '/auth/test',
      {},
      {
        headers: {
          Authorization: `Bearer ${savedTokenData.access_token}`,
        },
      },
    );
    console.log('response', response.data);
  };

  const onShare = async (text: string) => {
    await shareText(text, 'Share wallet address');
  };

  useEffect(() => {
    loadWalletSecurely().then(mnemonic => {
      if (mnemonic) {
        const { address, privateKey } = deriveEVMWalletFromMnemonic(mnemonic);
        setEvmWallet({ address, privateKey });
      }
    });
  }, []);

  useEffect(() => {
    if (user && !user.hasBackedUp) {
      toast.showInfo('Please, backup your secret recovery phrase!');
    }
  }, [user]);

  return (
    <>
      <ScrollView style={{ flex: 1, padding: 20 }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#4f46e5',
            padding: 14,
            borderRadius: 8,
            marginVertical: 8,
            alignItems: 'center',
          }}
          onPress={() => router.push('/backup')}
        >
          <Text testID='backup' style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Backup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#4f46e5',
            padding: 14,
            borderRadius: 8,
            marginVertical: 8,
            alignItems: 'center',
          }}
          onPress={() => router.push('/send')}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#4f46e5',
            padding: 14,
            borderRadius: 8,
            marginVertical: 8,
            alignItems: 'center',
          }}
          onPress={handleLogin}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#4f46e5',
            padding: 14,
            borderRadius: 8,
            marginVertical: 8,
            alignItems: 'center',
          }}
          onPress={handleRefresh}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#dc2626',
            padding: 14,
            borderRadius: 8,
            marginVertical: 8,
            alignItems: 'center',
          }}
          onPress={handleLogout}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Logout</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#6b7280',
            padding: 14,
            borderRadius: 8,
            marginVertical: 8,
            alignItems: 'center',
          }}
          onPress={handleTestAccessToken}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Test access token</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#4f46e5',
            padding: 14,
            borderRadius: 8,
            marginVertical: 8,
            alignItems: 'center',
          }}
          onPress={() => router.push('/components')}
        >
          <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>View Components</Text>
        </TouchableOpacity>

        <Text style={{ color: theme.text.primary }}>EVM Wallet: {evmWallet?.address}</Text>

        {evmWallet && evmWallet.address && (
          <View style={{ gap: 5, marginTop: 5, alignItems: 'center' }}>
            <WalletQr address={evmWallet.address} />
            <Pressable onPress={() => onShare(evmWallet.address)} style={{ padding: 12 }}>
              <Text style={{ color: theme.text.primary }}>Share Address</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </>
  );
};

export default Home;
