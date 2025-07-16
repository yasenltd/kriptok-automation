import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { validateMnemonic } from '../utils';

export default function ImportScreen() {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [importedMnemonic, setImportedMnemonic] = useState<string>('');

  const handleValidateImport = () => {
    const isValid = validateMnemonic(importedMnemonic.trim());
    if (isValid) {
      setMnemonic(importedMnemonic.trim());
      Alert.alert('Mnemonic Imported', 'Valid mnemonic has been imported.');
    } else {
      Alert.alert('Invalid', 'The entered mnemonic is not valid.');
    }
  };

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
