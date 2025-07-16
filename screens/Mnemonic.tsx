import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Alert, Pressable } from 'react-native';
import { generateMnemonic, validateMnemonic } from '../utils';

export default function MnemonicScreen() {
  const [mnemonic, setMnemonic] = useState<string>('');
  const [importedMnemonic, setImportedMnemonic] = useState<string>('');

  const handleGenerateMnemonic = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    setImportedMnemonic('');
  };

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

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleGenerateMnemonic}
      >
        <Text style={styles.buttonText}>Generate New Mnemonic</Text>
      </Pressable>

      {mnemonic ? (
        <View style={styles.mnemonicBox}>
          <Text selectable style={styles.mnemonicText}>
            {mnemonic}
          </Text>
        </View>
      ) : null}

      <Text style={styles.subtitle}>Or Import Existing Mnemonic</Text>

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
    backgroundColor: '#4338ca', // darker when pressed
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
