import { useState } from 'react';
import { Text, View, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import { useEffect } from 'react';
import { shareText } from '@/utils';
import { useSelector } from 'react-redux';
import Checkbox from '@/components/ui/AppCheckbox';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import Switch from '@/components/ui/Switch';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/useToast';
import { api, refreshInstance } from '@/services/apiClient';
import { RootState } from '@/stores/store';
import { AuthLogoutResponse, AuthRefreshResponse } from '@/types';
import { deriveEVMWalletFromMnemonic } from '@/utils';
import { getLoginMessage, login, signSiweMessage } from '@/utils/auth';
import { loadWalletSecurely } from '@/utils/secureStore';
import { getToken, saveToken } from '@/utils/tokenStorage';
import { router } from 'expo-router';
import WalletQr from '@components/WalletQr';
import { PlusIcon } from 'react-native-heroicons/micro';

// NOTE: Intended for initial testing and development purposes, to be removed later
const Home = () => {
  /* Hooks */
  const user = useSelector((state: RootState) => state.user.data);
  const toast = useToast();
  const { theme, colorScheme, toggleTheme } = useTheme();

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
        <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Backup</Text>
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
      <Text>EVM Wallet: {evmWallet?.address}</Text>

      {evmWallet && evmWallet.address && (
        <View style={{ gap: 5, marginTop: 5, alignItems: 'center' }}>
          <WalletQr address={evmWallet.address} />
          <Pressable onPress={() => onShare(evmWallet.address)} style={{ padding: 12 }}>
            <Text>Share Address</Text>
          </Pressable>
        </View>
      )}

      <Text style={{ color: theme.text.primary }}>Theme: {colorScheme ?? 'undefined'}</Text>

      <Switch
        size="L"
        value={colorScheme === 'dark'}
        onValueChange={() => {
          toggleTheme();
        }}
      />
      <Switch
        size="L"
        value={colorScheme === 'dark'}
        onValueChange={() => {
          toggleTheme();
        }}
        disabled={true}
      />

      <Button label="Default" state="default" style="accent" />
      <Button label="Default" state="loading" style="accent" showLeftIcon={true} />
      <Button label="Default" state="disabled" style="accent" />

      <Button label="Secondary" state="default" style="secondary" />
      <Button label="Secondary" state="loading" style="secondary" showLeftIcon={true} />
      <Button label="Secondary" state="disabled" style="secondary" />

      <Button label="Tertiary" state="default" style="tertiary" />
      <Button label="Tertiary" state="loading" style="tertiary" showLeftIcon={true} />
      <Button label="Tertiary" state="disabled" style="tertiary" />

      <Button label="Outline" state="default" style="outline" />
      <Button label="Outline" state="loading" style="outline" showLeftIcon={true} />
      <Button label="Outline" state="disabled" style="outline" />

      <Button label="Ghost" state="default" style="ghost" />
      <Button label="Ghost" state="loading" style="ghost" showLeftIcon={true} />
      <Button label="Ghost" state="disabled" style="ghost" />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
        <View>
          <IconButton state="default" style="accent" icon={<PlusIcon />} />
          <IconButton state="loading" style="accent" icon={<PlusIcon />} />
          <IconButton state="disabled" style="accent" icon={<PlusIcon />} />
        </View>

        <View>
          <IconButton state="default" style="secondary" icon={<PlusIcon />} />
          <IconButton state="loading" style="secondary" icon={<PlusIcon />} />
          <IconButton state="disabled" style="secondary" icon={<PlusIcon />} />
        </View>

        <View>
          <IconButton state="default" style="tertiary" icon={<PlusIcon />} />
          <IconButton state="loading" style="tertiary" icon={<PlusIcon />} />
          <IconButton state="disabled" style="tertiary" icon={<PlusIcon />} />
        </View>

        <View>
          <IconButton state="default" style="outline" icon={<PlusIcon />} />
          <IconButton state="loading" style="outline" icon={<PlusIcon />} />
          <IconButton state="disabled" style="outline" icon={<PlusIcon />} />
        </View>

        <View>
          <IconButton state="default" style="ghost" icon={<PlusIcon />} />
          <IconButton state="loading" style="ghost" icon={<PlusIcon />} />
          <IconButton state="disabled" style="ghost" icon={<PlusIcon />} />
        </View>
      </View>
      {/* 
        <Toggle options={[
          { label: 'Label', key: 'option1', icon: <PlusIcon /> },
          { label: 'Label', key: 'option2', icon: <PlusIcon /> },
          { label: 'Label', key: 'option3', icon: <PlusIcon /> },
        ]}></Toggle> */}

      <Checkbox label="Label" description="Description" value={false} onChange={() => {}} />
      <Checkbox label="Label" description="Description" value={true} onChange={() => {}} />
    </ScrollView>
  );
};

export default Home;
