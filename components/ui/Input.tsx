import React, {
  forwardRef,
  ReactElement,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Icon, InputSize, InputStyle, InputWidth } from '@/utils/types';
import { ColorValue, Text, TextInput, View, ViewStyle, StyleSheet, TextStyle } from 'react-native';
import { ExclamationCircleIcon } from 'react-native-heroicons/outline';
import { typography } from '@/theme/typography';
import { inputSizeMapping } from '@/utils';
import { useTheme } from '@/context/ThemeContext';

interface InputProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
  width?: InputWidth;
  size: InputSize;
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

type State = 'default' | 'focused' | 'disabled' | 'error';
type IconElement = React.ReactElement<{ size?: number; color?: ColorValue }>;

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
  const derivedState: State = disabled
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

  const widthStyle = useMemo(() => {
    if (typeof width === 'string') return { width: inputSizeMapping[width] };
    return { width: width?.width };
  }, [width]);

  const styles = useMemo(() => {
    const common = StyleSheet.create({
      container: { flexDirection: 'column', gap: 6 },
      label: { ...typography.input.label, color: theme.text.primary },
      hint: { ...typography.input.hint, color: theme.text.tertiary },
      disabledHint: { ...typography.input.hint, color: theme.text.disabled },
      error: { ...typography.input.hint, color: theme.text.error },
      textInputBase: {
        flexGrow: 1,
        flexShrink: 0,
        color: theme.text.primary,
        textAlignVertical: 'center',
      },
      inputWrapperBase: {
        gap: 8,
        borderWidth: 1,
        borderRadius: 9999,
      },
      rightSection: {
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        gap: 8,
      },
    });

    const normal = StyleSheet.create({
      textInput: {
        ...typography.input.placeholder,
        ...common.textInputBase,
      },
      inputWrapper: {
        ...common.inputWrapperBase,
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        height: 40,
        paddingHorizontal: 10,
        paddingVertical: 8,
      },
    });

    const fillBase: ViewStyle = { backgroundColor: theme.input.fill.default };
    const fillState: Record<State, ViewStyle> = {
      default: {},
      focused: { borderColor: theme.input.fill.pressedStroke },
      disabled: {
        backgroundColor: theme.input.stroke.default,
        borderColor: theme.input.fill.disabled,
      },
      error: { borderColor: theme.input.fill.error },
    };

    const strokeBase: ViewStyle = {};
    const strokeState: Record<State, ViewStyle> = {
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
      common,
      normal,
      rightSection: common.rightSection,
      getWrapperFor(variant: InputStyle, state: State): ViewStyle {
        return variant === 'fill'
          ? { ...fillBase, ...fillState[state] }
          : { ...strokeBase, ...strokeState[state] };
      },
      getPlaceholderFor(state: State): TextStyle {
        return state === 'disabled' ? placeholderMap.disabled : placeholderMap.enabled;
      },
      getHintFor(state: State): TextStyle {
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
      return React.cloneElement(icon as IconElement, { size: iconSize, color: iconColor });
    }
    return null;
  }, []);

  return (
    <View style={[styles.common.container, style]}>
      {label && <Text style={styles.common.label}>{label}</Text>}

      <View style={widthStyle}>
        <View style={[wrapperStyle, styles.normal.inputWrapper]}>
          <View pointerEvents="none">
            {leftIcon && renderIcon(leftIcon, 20, styles.normal.textInput.color)}
          </View>
          <TextInput
            ref={innerRef}
            style={[styles.normal.textInput, { flex: 1 }]}
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
          <View style={styles.rightSection} pointerEvents="none">
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
