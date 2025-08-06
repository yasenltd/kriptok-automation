import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Pressable, Text, Keyboard } from 'react-native';
import { Icon, Text as TextPaper } from 'react-native-paper';
import { useClickOutside } from 'react-native-click-outside';
import { colors, textSize } from '@/utils';
import { inputSizeMapping as sizeMapping } from '@/utils';

interface AppSelectInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  size: 'small' | 'medium' | 'large' | 'screen';
  style?: 'flat' | 'outlined';
  data: string[];
  label?: string;
}

const AppSelectInput: React.FC<AppSelectInputProps> = ({
  value,
  onChange,
  placeholder = '',
  size,
  style = 'outlined',
  data,
  label,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>(value);
  const savedValue = useRef(value);

  const filtered = useMemo(() => {
    if (open && search === '') return data;
    return data.filter(item => item.toLowerCase().includes(search.toLowerCase()));
  }, [data, search, open]);

  const openDropdown = () => {
    savedValue.current = value;
    setSearch('');
    setOpen(true);
  };
  const closeDropdown = () => {
    setOpen(false);
    setSearch(savedValue.current);
  };

  const ref = useClickOutside<View>(closeDropdown);

  const handleSelect = (item: string) => {
    onChange(item);
    setOpen(false);
    Keyboard.dismiss();
  };

  useEffect(() => {
    if (!open) {
      setSearch(value);
      savedValue.current = value;
    }
  }, [value, open]);

  return (
    <View ref={ref} style={{ width: sizeMapping[size] }}>
      {label && (
        <TextPaper variant="bodySmall" style={styles.label}>
          {label}
        </TextPaper>
      )}

      <View style={[styles.inputWrapper, style === 'outlined' && styles.outlinedBorder]}>
        {open ? <Icon source={'magnify'} size={24} color={colors['text-black']} /> : null}
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          value={open ? search : value}
          onChangeText={text => {
            setSearch(text);
            if (!open) setOpen(true);
          }}
          onFocus={openDropdown}
          placeholderTextColor={colors['text-grey']}
        />

        <Pressable style={styles.icon} onPress={() => (open ? closeDropdown() : openDropdown())}>
          <Icon
            source={open ? 'chevron-up' : 'chevron-down'}
            size={24}
            color={colors['text-black']}
          />
        </Pressable>
      </View>

      {open && filtered.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filtered}
            keyExtractor={(item, i) => `${item}-${i}`}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.dropdownItem,
                  pressed && { backgroundColor: colors['text-secondary'] },
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </Pressable>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default AppSelectInput;

const styles = StyleSheet.create({
  label: {
    color: colors['text-secondary'],
    marginLeft: 5,
    marginBottom: 5,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors['primary-white'],
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors['primary-grey'],
    height: 40,
    paddingHorizontal: 15,
  },
  outlinedBorder: {
    borderRadius: 100,
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: textSize['medium'],
    color: colors['text-grey'],
    paddingVertical: 0,
    fontFamily: 'montserrat-regular',
  },
  icon: {
    marginLeft: 10,
  },
  dropdown: {
    position: 'absolute',
    bottom: '70%',
    left: 0,
    right: 0,
    backgroundColor: colors['primary-white'],
    borderWidth: 1,
    borderColor: colors['primary-grey'],
    borderRadius: 8,
    maxHeight: 150,
    zIndex: 99,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownItemText: {
    fontSize: textSize['medium'],
    color: colors['text-black'],
  },
});
