import React, { useCallback, useState } from 'react';
import { Text, TextInput, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import {
  deriveAllWalletsFromMnemonic,
  saveToken,
  storeAllPrivKeys,
  validateMnemonic,
} from '../utils';
import AppModal from '@components/ui/AppModal';
import { useToast } from '@/hooks/useToast';
import { getLoginMessage, getSignupMessage, login, signSiweMessage, signup } from '@/utils/auth';
import { loadPrivkeyFromPin, setPin, storeWalletSecurely } from '@/utils/secureStore';
import { WalletAddresses } from '@/types';
import { getUser } from '@/utils/users';
import { setUser } from '@/stores/user/userSlice';

import { useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

export default function ImportScreen() {
  const toast = useToast();
  const { setIsAuthenticated } = useAuth();
  const dispatch = useDispatch();

  /* State */
  const [importedMnemonic, setImportedMnemonic] = useState<string>('');
  const [pinModalVisible, setPinModalVisible] = useState(false);

  const [evmWallet, setEvmWallet] = useState({ address: '' });
  const [btcWallet, setBtcWallet] = useState({ address: '' });
  const [solWallet, setSolWallet] = useState({ address: '' });
  const [suiWallet, setSuiWallet] = useState({ address: '' });

  const [pin, setPinInput] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  /* Handlers */
  const handleValidateImport = useCallback(async () => {
    const mnemonic = importedMnemonic.trim();
    const isValid = validateMnemonic(mnemonic);
    if (isValid) {
      await storeWalletSecurely(mnemonic);
      const wallets = deriveAllWalletsFromMnemonic(mnemonic);

      //store priv keys
      await storeAllPrivKeys({
        eth: wallets.evm.privateKey,
        sol: wallets.solana.privateKey,
        sui: wallets.sui.privateKey,
        btc: wallets.bitcoin.privateKey,
      });
      setWallets(
        Object.keys(wallets).reduce((acc, key) => {
          acc[key as keyof WalletAddresses] = {
            address: wallets[key as keyof WalletAddresses].address,
          };
          return acc;
        }, {} as WalletAddresses),
      );

      setPinModalVisible(true);
    } else {
      toast.showError('Invalid mnemonic.');
    }
  }, [importedMnemonic]);

  const setWallets = useCallback((wallets: WalletAddresses) => {
    console.log(wallets);
    setEvmWallet(wallets.evm);
    setBtcWallet(wallets.bitcoin);
    setSolWallet(wallets.solana);
    setSuiWallet(wallets.sui);
  }, []);

  const handleSecureSave = useCallback(async () => {
    if (pin !== confirmPin) {
      toast.showError('PINs do not match.');
      return;
    }
    if (pin.length !== 6 || confirmPin.length !== 6) {
      toast.showError('PIN must be 6 digits.');
      return;
    }

    try {
      await setPin(pin);

      const privateKey = (await loadPrivkeyFromPin(pin, 'eth')) || '';
      if (!privateKey) {
        toast.showError('Wrong pin. Try again.');
        return;
      }

      const { message: signupMessage } = await getSignupMessage(evmWallet.address);
      const signupSignature = await signSiweMessage(signupMessage, privateKey);
      // signup user
      await signup({
        eth: evmWallet.address,
        btc: btcWallet.address,
        sui: suiWallet.address,
        solana: solWallet.address,
        signature: signupSignature,
        message: signupMessage,
      });
      //generate message
      const { message } = await getLoginMessage(evmWallet.address);
      // sign message
      const signature = await signSiweMessage(message, privateKey);
      //obtain tokens
      const { access_token, expires_in, refresh_token, refresh_expires_in } = await login(
        message,
        signature,
      );
      await saveToken({
        access_token,
        refresh_token,
        expires_in: expires_in.toString(),
        refresh_expires_in: refresh_expires_in.toString(),
      });
      const user = await getUser();
      dispatch(setUser(user));
      setPinModalVisible(false);
      //Why storing this here? Shouldn't be stored right after validation?
      setIsAuthenticated(true);
      router.replace('/home');
      toast.showSuccess('Success! Your wallet and PIN are secured.');
    } catch (err) {
      console.error('Secure store error:', err);
      toast.showError('Failed to save your wallet.');
    }
  }, [pin, confirmPin]);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kriptok Wallet</Text>

      <Text style={styles.subtitle}>Import Existing Mnemonic</Text>

      <TextInput
        style={styles.input}
        multiline
        placeholder="Enter your 12 or 24 words here"
        value={importedMnemonic}
        onChangeText={setImportedMnemonic}
      />

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleValidateImport}
      >
        <Text style={styles.buttonText}>Validate & Import</Text>
      </Pressable>

      <AppModal
        visible={pinModalVisible}
        onClose={() => setPinModalVisible(false)}
        title="Set Your 6-Digit PIN"
        width="medium"
        canClose={false}
      >
        <Text style={{ marginBottom: 10 }}>Enter a 6-digit PIN to protect your wallet.</Text>
        <TextInput
          testID="enter-pin"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={6}
          secureTextEntry
          value={pin}
          onChangeText={setPinInput}
          placeholder="Enter PIN"
        />
        <TextInput
          testID="confirm-pin"
          style={styles.input}
          keyboardType="number-pad"
          maxLength={6}
          secureTextEntry
          value={confirmPin}
          onChangeText={setConfirmPin}
          placeholder="Confirm PIN"
        />
        <Pressable testID="save-pin" style={styles.button} onPress={handleSecureSave}>
          <Text style={styles.buttonText}>Save PIN</Text>
        </Pressable>
      </AppModal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 30,
    fontSize: 16,
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: '#4338ca',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  mnemonicBox: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  mnemonicText: {
    fontSize: 16,
    color: '#111827',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    minHeight: 80,
    width: '100%',
    textAlignVertical: 'top',
  },
});
