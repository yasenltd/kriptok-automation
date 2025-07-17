import React, { useEffect, useState } from 'react';
import { LanguageType } from '@/types';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/stores/store';
import { setLanguage } from '@/stores/language/languageSlice';
import { useTranslation } from 'react-i18next';
import i18n from '@/utils/i18n';

const LanguageSelection = () => {
  const { t } = useTranslation();
  const language = useSelector((state: RootState) => state.language.language);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>(language);
  const [items, setItems] = useState([
    { label: 'English', value: 'en' },
    { label: 'Türkçe', value: 'tr' },
  ]);

  const handleChange = () => {
    dispatch(setLanguage(selectedLanguage));
  };

  useEffect(() => {
    if (selectedLanguage !== language) {
      handleChange();
      i18n.changeLanguage(selectedLanguage);
    }
  }, [selectedLanguage]);

  return (
    <View>
      <Text style={styles.title}>{t('selectLanguage')}</Text>

      <View>
        <DropDownPicker
          open={open}
          value={language}
          items={items}
          setOpen={setOpen}
          setValue={setSelectedLanguage}
          setItems={setItems}
          placeholder="Select a language"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={1000}
        />
      </View>
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

export default LanguageSelection;
