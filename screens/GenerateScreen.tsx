import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { deriveEVMWalletFromMnemonic, generateMnemonic } from '../utils';

export default function GenerateScreen() {
  /* State */
  const [mnemonic, setMnemonic] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [privateKey, setPrivateKey] = useState<string>('');

  /* Handlers */
  const handleGenerateMnemonic = useCallback(() => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);

    const { address, privateKey } = deriveEVMWalletFromMnemonic(newMnemonic);
    setAddress(address);
    setPrivateKey(privateKey);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kriptok Wallet</Text>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleGenerateMnemonic}
      >
        <Text style={styles.buttonText}>Generate New Mnemonic</Text>
      </Pressable>

      {mnemonic ? (
        <>
          <View style={styles.mnemonicBox}>
            <Text>Mnemonic:</Text>
            <Text selectable style={styles.mnemonicText}>
              {mnemonic}
            </Text>
          </View>
          <View style={styles.mnemonicBox}>
            <Text>Address:</Text>
            <Text selectable style={styles.mnemonicText}>
              {address}
            </Text>
          </View>
          <View style={styles.mnemonicBox}>
            <Text>Private Key:</Text>
            <Text selectable style={styles.mnemonicText}>
              {privateKey}
            </Text>
          </View>
        </>
      ) : null}
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
