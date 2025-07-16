import React, { useState } from 'react';
import { LanguageType } from '@/types';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/stores/store';
import { setState } from '@/stores/language/languageSlice';

const LanguageSelectionScreen = () => {
  const language = useSelector((state: RootState) => state.language.language);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>(language);
  const [items, setItems] = useState([
    { label: 'English', value: 'en' },
    { label: 'Türkçe', value: 'tr' },
  ]);

  const handleConfirm = () => {
    dispatch(setState({ language: selectedLanguage, hasBeenSet: true }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Language</Text>

      <View>
        <DropDownPicker
          open={open}
          value={selectedLanguage}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedLanguage}
          setItems={setItems}
          onChangeValue={val => setSelectedLanguage(val as LanguageType)}
          placeholder="Select a language"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={1000}
        />
      </View>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={handleConfirm}
      >
        <Text style={styles.buttonText}>Confirm</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  pickerItem: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4f46e5',
    padding: 14,
    borderRadius: 8,
    marginTop: 40,
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
  dropdown: {
    borderColor: '#d1d5db',
    marginBottom: 20,
  },
  dropdownContainer: {
    borderColor: '#d1d5db',
  },
});

export default LanguageSelectionScreen;
