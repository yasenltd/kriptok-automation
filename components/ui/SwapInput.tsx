import React, {
  Dispatch,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';
import { ValueType } from 'react-native-dropdown-picker';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { inputSizeMapping } from '../../utils';
import { formatNumber } from '../../utils/numberUtils';
import { InputState, InputStyle, InputWidth, TokenItem } from '../../utils/types';
import { commonStyles } from '../styles/inputStyles';
import Link from './Link';
import TokenSelector from './TokenSelector';

interface SwapInputProps {
  value: string;
  setValue: Dispatch<React.SetStateAction<string>>;
  balance: number;
  tokenValue: ValueType | null;
  setTokenValue: Dispatch<React.SetStateAction<ValueType | null>>;
  tokenItems: Array<TokenItem>;
  setTokenItems: Dispatch<React.SetStateAction<Array<TokenItem>>>;
  onChange?: (text: string) => void;
  placeholder?: string;
  width?: InputWidth;
  variant?: InputStyle;
  label?: string;
  disabled?: boolean;
  hint?: string;
  error?: string;
  setError?: Dispatch<React.SetStateAction<string | undefined>>;
  style?: ViewStyle;
}

const SwapInput = forwardRef<TextInput, SwapInputProps>(function SwapInput(
  {
    value,
    setValue,
    balance,
    tokenValue,
    setTokenValue,
    tokenItems,
    setTokenItems,
    onChange = newValue => setValue(newValue),
    width = 'screen',
    variant = 'stroke',
    label,
    disabled = false,
    placeholder = '0.00',
    error,
    hint,
    style,
  },
  inputRef,
) {
  const { theme } = useTheme();
  const innerRef = useRef<TextInput>(null);

  const [isFocused, setIsFocused] = React.useState(false);
  const derivedState: InputState = disabled
    ? 'disabled'
    : error
      ? 'error'
      : isFocused
        ? 'focused'
        : 'default';

  useImperativeHandle(inputRef, () => innerRef.current as TextInput);

  const swapStyles = useSwapInputStyles(theme);

  const widthStyle = useMemo(() => {
    if (typeof width === 'string') return { width: inputSizeMapping[width] };
    return { width: width?.width };
  }, [width]);

  const styles = useMemo(() => {
    const fillBase: ViewStyle = { backgroundColor: theme.input.fill.default };
    const fillState: Record<InputState, ViewStyle> = {
      default: {},
      focused: { borderColor: theme.input.fill.pressedStroke },
      disabled: {
        backgroundColor: theme.input.stroke.default,
        borderColor: theme.input.fill.disabled,
      },
      error: { borderColor: theme.input.fill.error },
    };

    const strokeBase: ViewStyle = {};
    const strokeState: Record<InputState, ViewStyle> = {
      default: { borderColor: theme.input.stroke.default },
      focused: {
        backgroundColor: theme.input.stroke.default,
        borderColor: theme.input.stroke.pressedStroke,
      },
      disabled: { borderColor: theme.input.stroke.disabled },
      error: { borderColor: theme.input.stroke.error },
    };

    return {
      getWrapperFor(variant: InputStyle, state: InputState): ViewStyle {
        return variant === 'fill'
          ? { ...fillBase, ...fillState[state] }
          : { ...strokeBase, ...strokeState[state] };
      },
    };
  }, [theme]);

  const wrapperStyle = useMemo(
    () => [swapStyles.inputWrapper, styles.getWrapperFor(variant, derivedState)],
    [swapStyles, variant, derivedState, styles],
  );

  const handleChange = useCallback(
    (text: string) => {
      const clean = text.replace(/[^0-9.,]/g, '');
      onChange(clean);
    },
    [onChange],
  );

  const handleFocus = useCallback(() => !disabled && setIsFocused(true), [disabled]);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  return (
    <View style={[swapStyles.container, style]}>
      {label && <Text style={swapStyles.label}>{label}</Text>}
      <Pressable onPress={() => innerRef.current?.focus() && handleFocus()}>
        <View style={widthStyle}>
          <View style={wrapperStyle}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TextInput
                ref={innerRef}
                style={[swapStyles.textInput, { flex: 1 }]}
                value={value}
                onChangeText={handleChange}
                keyboardType="decimal-pad"
                autoCapitalize="none"
                placeholder={placeholder}
                placeholderTextColor={swapStyles.placeholder.color}
                editable={!disabled}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <View>
                <TokenSelector
                  value={tokenValue}
                  setValue={setTokenValue}
                  items={tokenItems}
                  setItems={setTokenItems}
                />
              </View>
            </View>
            <View style={swapStyles.lowerSection}>
              <Text style={swapStyles.balance}>
                Balance: {formatNumber(balance)} {tokenValue}
              </Text>
              <Link
                label="MAX"
                size="S"
                variant="secondary"
                onPress={() => setValue(balance.toString())}
              />
            </View>
          </View>
        </View>
      </Pressable>
      {error ? (
        <Text style={swapStyles.error}>{error}</Text>
      ) : hint ? (
        <Text style={swapStyles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
});

export default SwapInput;

const useSwapInputStyles = (theme: any) => {
  return StyleSheet.create({
    ...commonStyles,
    container: {
      width: '100%',
    },
    label: { ...commonStyles.label, color: theme.text.primary },
    hint: { ...commonStyles.hint, color: theme.text.tertiary },
    error: { ...commonStyles.error, color: theme.text.error },
    textInput: {
      ...commonStyles.textInput,
      ...typography.swapInput.value,
      textAlignVertical: 'center',
      color: theme.text.primary,
    },
    placeholder: {
      ...typography.input.placeholder,
      color: theme.text.tertiary,
    },
    balance: {
      ...typography.swapInput.balance,
      color: theme.text.tertiary,
    },
    inputWrapper: {
      ...commonStyles.inputWrapper,
      height: 96,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'stretch',
      alignContent: 'center',
      paddingLeft: 12,
      paddingRight: 8,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: theme.input.fill.default,
      borderWidth: 1,
      borderColor: theme.input.stroke.default,
    },
    lowerSection: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      alignContent: 'flex-end',
      gap: 8,
      paddingVertical: 4,
      paddingHorizontal: 12,
    },
  });
};
