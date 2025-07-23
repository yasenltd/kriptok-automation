import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { deriveAllWalletsFromMnemonic, generateMnemonic, storeWalletSecurely } from '@/utils';
import AppModal from '@components/ui/AppModal';
import { useToast } from '@/hooks/useToast';
import { setPin } from '@/utils/secureStore';
import { Wallets } from '@/types';
import { getLoginMessage, login, signSiweMessage, signup } from '@/utils/auth';

export default function GenerateScreen() {
  /*Hooks */
  const toast = useToast();

  /* State */
  const [mnemonic, setMnemonic] = useState<string>('');

  const [evmWallet, setEvmWallet] = useState({ address: '', privateKey: '' });
  const [btcWallet, setBtcWallet] = useState({ address: '', privateKey: '' });
  const [solWallet, setSolWallet] = useState({ address: '', privateKey: '' });
  const [suiWallet, setSuiWallet] = useState({ address: '', privateKey: '' });

  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pin, setPinInput] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  /* Handlers */

  const setWallets = useCallback((wallets: Wallets) => {
    console.log(wallets);
    setEvmWallet(wallets.evm);
    setBtcWallet(wallets.bitcoin);
    setSolWallet(wallets.solana);
    setSuiWallet(wallets.sui);
  }, []);

  const clearPrivateKeys = useCallback(() => {
    setEvmWallet(prev => ({ ...prev, privateKey: '' }));
    setBtcWallet(prev => ({ ...prev, privateKey: '' }));
    setSolWallet(prev => ({ ...prev, privateKey: '' }));
    setSuiWallet(prev => ({ ...prev, privateKey: '' }));
  }, []);

  const handleGenerateMnemonic = useCallback(async () => {
    try {
      const newMnemonic = generateMnemonic();
      setMnemonic(newMnemonic);

      const wallets = await deriveAllWalletsFromMnemonic(newMnemonic);

      setWallets(wallets);

      setPinModalVisible(true);
    } catch (err) {
      console.error('Something went wrong:', err);
    }
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
      // signup user
      await signup({
        eth: evmWallet.address,
        btc: btcWallet.address,
        sui: suiWallet.address,
        solana: solWallet.address,
      });
      //generate message
      const { message } = await getLoginMessage(evmWallet.address);
      // sign message
      const signature = await signSiweMessage(message, evmWallet.privateKey);
      console.log('🔐 Incoming message:\n', message);
      console.log('✍️ Incoming signature:\n', signature);

      //obtain tokens
      const { access_token, expires_in, refresh_token, refresh_expires_in } = await login(
        message,
        signature,
      );

      clearPrivateKeys();

      await setPin(pin);
      await storeWalletSecurely(mnemonic, pin);
      setPinModalVisible(false);
      console.log('Access token: ', access_token);
      console.log('Access expires in', expires_in);

      console.log('Refresh token: ', refresh_token);
      console.log('Refresh expires in', refresh_expires_in);
      toast.showSuccess('Success! Your wallet and PIN are secured.');
    } catch (err) {
      console.error('Secure store error:', err);
      toast.showError('Failed to save your wallet.');
    }
  }, [pin, confirmPin, mnemonic]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kriptok Wallet</Text>

      <Pressable
        testID="generate-new-mnemonic"
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleGenerateMnemonic}
      >
        <Text style={styles.buttonText}>Generate New Mnemonic</Text>
      </Pressable>

      {mnemonic ? (
        <>
          <View style={styles.mnemonicBox}>
            <Text testID="mnemonic-label">Mnemonic:</Text>
            <Text selectable style={styles.mnemonicText}>
              {mnemonic}
            </Text>
          </View>

          {/* EVM */}
          <Text style={styles.subtitle}>EVM (Ethereum / BNB / Polygon)</Text>
          <View style={styles.mnemonicBox}>
            <Text>Address:</Text>
            <Text selectable style={styles.mnemonicText}>
              {evmWallet.address}
            </Text>
            <Text>Private Key:</Text>
            <Text selectable style={styles.mnemonicText}>
              {evmWallet.privateKey}
            </Text>
          </View>

          {/* Bitcoin */}
          <Text style={styles.subtitle}>Bitcoin</Text>
          <View style={styles.mnemonicBox}>
            <Text>Address:</Text>
            <Text selectable style={styles.mnemonicText}>
              {btcWallet.address}
            </Text>
            <Text>Private Key:</Text>
            <Text selectable style={styles.mnemonicText}>
              {btcWallet.privateKey}
            </Text>
          </View>

          {/* Solana */}
          <Text style={styles.subtitle}>Solana</Text>
          <View style={styles.mnemonicBox}>
            <Text>Address:</Text>
            <Text selectable style={styles.mnemonicText}>
              {solWallet.address}
            </Text>
            <Text>Private Key:</Text>
            <Text selectable style={styles.mnemonicText}>
              {solWallet.privateKey}
            </Text>
          </View>

          {/* Sui */}
          <Text style={styles.subtitle}>Sui</Text>
          <View style={styles.mnemonicBox}>
            <Text>Address:</Text>
            <Text selectable style={styles.mnemonicText}>
              {suiWallet.address}
            </Text>
            <Text>Private Key:</Text>
            <Text selectable style={styles.mnemonicText}>
              {suiWallet.privateKey}
            </Text>
          </View>
        </>
      ) : null}

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
    minHeight: 60,
    textAlignVertical: 'top',
  },
});
