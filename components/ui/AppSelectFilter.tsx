import React, { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View, TextInput, FlatList, Pressable, Text, Keyboard } from 'react-native';
import { Icon, Portal, Text as TextPaper } from 'react-native-paper';
import { inputSizeMapping as sizeMapping, colors, textSize } from '@/utils';
import { useClickOutside } from 'react-native-click-outside';

interface AppSelectInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  size: 'small' | 'medium' | 'large' | 'screen';
  style?: 'flat' | 'outlined';
  data: string[];
  label?: string;
}

const AppSelectFilter: React.FC<AppSelectInputProps> = ({
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
  const wrapperRef = useRef<View>(null);
  const [dropdownPos, setDropdownPos] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 0,
  });

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

  const measureDropdownPosition = () => {
    wrapperRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownPos({
        top: y + height,
        left: x,
        width,
      });
    });
  };

  const refOutside = useClickOutside<View>(closeDropdown);

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
    <View ref={wrapperRef} style={{ width: sizeMapping[size] }} onLayout={measureDropdownPosition}>
      {label && (
        <TextPaper variant="bodySmall" style={styles.label}>
          {label}
        </TextPaper>
      )}

      <View
        ref={refOutside}
        style={[styles.inputWrapper, style === 'outlined' && styles.outlinedBorder]}
      >
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
        <Portal>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            pointerEvents="box-none"
          >
            <View style={[styles.dropdown, { width: dropdownPos.width }]}>
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
          </View>
        </Portal>
      )}
    </View>
  );
};

export default AppSelectFilter;

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
    top: 60,
    left: 70,
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
