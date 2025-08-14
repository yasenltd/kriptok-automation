import { FeatherIconType } from '@/types';
import { colors, textSize } from '@/utils';
import { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { inputSizeMapping as sizeMapping } from '@/utils';
import { Feather } from '@expo/vector-icons';

interface AppInputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  icon?: string;
  isPassword: boolean;
  size: 'small' | 'medium' | 'large' | 'screen';
  style?: 'flat' | 'outlined';
  label?: string;
  onPasteFullCode?: (text: string) => void;
  inputRef?: React.RefObject<TextInput> | ((instance: TextInput | null) => void);
  disabled?: boolean;
}

const AppInput: React.FC<AppInputProps> = ({
  value,
  onChange,
  isPassword,
  size,
  style = 'outlined',
  label,
  inputRef,
  disabled = false,
  icon,
  placeholder = '',
}) => {
  const [isSecure, setIsSecure] = useState(isPassword);

  const toggleSecureEntry = () => setIsSecure(prev => !prev);

  const handleChange = (text: string) => {
    onChange(text);
  };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          { width: sizeMapping[size] },
          icon && !isPassword && { flexDirection: 'row', alignItems: 'center', paddingLeft: 12 },
          style === 'outlined' && styles.outlinedBorder,
        ]}
      >
        {icon && !isPassword && (
          <Feather name={icon as FeatherIconType} size={16} color={colors['text-secondary']} />
        )}
        <TextInput
          style={styles.textInput}
          onChangeText={handleChange}
          autoCapitalize="none"
          secureTextEntry={isSecure}
          value={value}
          placeholder={placeholder ?? ''}
          placeholderTextColor={colors['text-secondary']}
          ref={inputRef}
          editable={!disabled}
        />
        {isPassword && (
          <Pressable style={styles.icon} onPress={toggleSecureEntry}>
            <Icon source={isSecure ? 'eye-off' : 'eye'} size={20} color={colors['text-black']} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  inputWrapper: {
    backgroundColor: colors['primary-white'],
    borderRadius: 8,
  },
  textInput: {
    width: '100%',
    fontSize: textSize['medium'],
    color: colors['text-grey'],
    paddingVertical: 12,
    paddingHorizontal: 15,
    height: 40,
    fontFamily: 'montserrat-regular',
  },
  outlinedBorder: {
    borderWidth: 1,
    borderColor: colors['primary-grey'],
    borderRadius: 8,
  },
  label: {
    fontSize: textSize['small'],
    fontFamily: 'montserrat-regular',
    color: colors['text-secondary'],
    marginLeft: 5,
    marginBottom: 5,
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: '-50%' }],
  },
});
