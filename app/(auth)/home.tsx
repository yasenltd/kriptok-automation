import { getLoginMessage, login, signSiweMessage } from '@/utils/auth';
import { getToken, saveToken } from '@/utils/tokenStorage';
import { useState } from 'react';
import { Button, Text, View } from 'react-native';
import { AuthLogoutResponse, AuthRefreshResponse } from '@/types';
import { refreshInstance, api } from '@/services/apiClient';
import { loadWalletSecurely } from '@/utils/secureStore';
import { useEffect } from 'react';
import { deriveEVMWalletFromMnemonic } from '@/utils';
// NOTE: Intended for initial testing and development purposes, to be removed later
const Home = () => {
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

  useEffect(() => {
    loadWalletSecurely().then(mnemonic => {
      if (mnemonic) {
        const { address, privateKey } = deriveEVMWalletFromMnemonic(mnemonic);
        setEvmWallet({ address, privateKey });
      }
    });
  }, []);
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text
        style={{
          fontSize: 28,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 30,
          color: '#333',
        }}
      >
        Home Page
      </Text>
      <Button title="Login" onPress={handleLogin} />
      <Button title="Refresh" onPress={handleRefresh} />
      <Button title="Logout" onPress={handleLogout} />
      <Button title="Test access token" onPress={handleTestAccessToken} />
      <Text>EVM Wallet: {evmWallet?.address}</Text>
    </View>
  );
};

export default Home;
