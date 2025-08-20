import { useTheme } from '@/context/ThemeContext';
import { typography } from '@/theme/typography';
import { inputSizeMapping } from '@/utils';
import { Icon, InputState, InputStyle, InputWidth } from '@/utils/types';
import React, {
  forwardRef,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { ColorValue, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { ExclamationCircleIcon } from 'react-native-heroicons/outline';
import { commonStyles } from '../styles/inputStyles';

interface InputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  width?: InputWidth;
  variant?: InputStyle;
  label?: string;
  disabled?: boolean;
  leftIcon?: Icon;
  actionButton?: React.ReactNode;
  firstRightButton?: ReactElement;
  secondRightButton?: ReactElement;
  hint?: string;
  error?: string;
  style?: ViewStyle;
}

const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    value,
    onChange,
    width = 'screen',
    variant = 'stroke',
    label,
    disabled = false,
    placeholder = '',
    leftIcon,
    actionButton,
    firstRightButton,
    secondRightButton,
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

  const handleChange = useCallback((text: string) => onChange(text), [onChange]);
  const handleFocus = useCallback(() => !disabled && setIsFocused(true), [disabled]);
  const handleBlur = useCallback(() => setIsFocused(false), []);
  useImperativeHandle(inputRef, () => innerRef.current as TextInput);

  const { textAreaStyles } = useInputStyles();

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

    const placeholderMap: Record<'enabled' | 'disabled', TextStyle> = {
      enabled: { ...typography.input.placeholder, color: theme.text.tertiary },
      disabled: { ...typography.input.placeholder, color: theme.input.fill.disabled },
    };

    const hintMap: Record<'default' | 'disabled' | 'error', TextStyle> = {
      default: { ...typography.input.hint, color: theme.text.tertiary },
      disabled: { ...typography.input.hint, color: theme.text.disabled },
      error: { ...typography.input.hint, color: theme.text.error },
    };

    return {
      getWrapperFor(variant: InputStyle, state: InputState): ViewStyle {
        return variant === 'fill'
          ? { ...fillBase, ...fillState[state] }
          : { ...strokeBase, ...strokeState[state] };
      },
      getPlaceholderFor(state: InputState): TextStyle {
        return state === 'disabled' ? placeholderMap.disabled : placeholderMap.enabled;
      },
      getHintFor(state: InputState): TextStyle {
        if (state === 'disabled') return hintMap.disabled;
        if (state === 'error') return hintMap.error;
        return hintMap.default;
      },
    };
  }, [theme]);

  const wrapperStyle = useMemo(
    () => styles.getWrapperFor(variant, derivedState),
    [styles, variant, derivedState],
  );
  const placeholderStyle = useMemo(
    () => styles.getPlaceholderFor(derivedState),
    [styles, derivedState],
  );
  const hintStyle = useMemo(() => styles.getHintFor(derivedState), [styles, derivedState]);

  const renderIcon = useCallback((icon: Icon, iconSize: number, iconColor: ColorValue) => {
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon as ReactElement<Icon>, { size: iconSize, color: iconColor });
    }
    return null;
  }, []);

  return (
    <View style={[textAreaStyles.container, style]}>
      {label && <Text style={textAreaStyles.label}>{label}</Text>}

      <View style={widthStyle}>
        <View style={[wrapperStyle, textAreaStyles.inputWrapper]}>
          <View pointerEvents="none">
            {leftIcon && renderIcon(leftIcon, 20, textAreaStyles.textInput.color)}
          </View>
          <TextInput
            ref={innerRef}
            style={[textAreaStyles.textInput, { flex: 1 }]}
            value={value}
            onChangeText={handleChange}
            placeholder={placeholder ?? ''}
            placeholderTextColor={placeholderStyle.color}
            autoCapitalize="none"
            editable={!disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            spellCheck={false}
            autoCorrect={false}
            textContentType="none"
          />
          <View style={textAreaStyles.rightSection}>
            {derivedState === 'error' &&
              renderIcon(<ExclamationCircleIcon />, 20, (wrapperStyle as any).borderColor)}
            {actionButton}
            {firstRightButton}
            {secondRightButton}
          </View>
        </View>
      </View>

      {error ? (
        <Text style={hintStyle}>{error}</Text>
      ) : hint ? (
        <Text style={hintStyle}>{hint}</Text>
      ) : null}
    </View>
  );
});

export default Input;

const useInputStyles = () => {
  const { theme } = useTheme();
  const textAreaStyles = useMemo(
    () =>
      StyleSheet.create({
        ...commonStyles,
        label: { ...commonStyles.label, color: theme.text.primary },
        hint: { ...commonStyles.hint, color: theme.text.tertiary },
        disabledHint: { ...commonStyles.disabledHint, color: theme.text.disabled },
        error: { ...commonStyles.error, color: theme.text.error },
        rightSection: {
          flexDirection: 'row',
          alignContent: 'center',
          alignItems: 'center',
          gap: 8,
        },
        textInput: {
          ...commonStyles.textInput,
          color: theme.text.primary,
          textAlignVertical: 'center',
        },
        inputWrapper: {
          ...commonStyles.inputWrapper,
          flexDirection: 'row',
          alignItems: 'center',
          alignContent: 'center',
          height: 40,
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderRadius: 9999,
          gap: 8,
        },
      }),
    [theme],
  );

  return { textAreaStyles };
};
