import { useTheme } from '@/context/ThemeContext';
import { typography } from '@/theme/typography';
import { inputSizeMapping } from '@/utils';
import { Icon, InputState, InputStyle, InputWidth } from '@/utils/types';
import React, {
  Dispatch,
  forwardRef,
  SetStateAction,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { ColorValue, StyleSheet, Text, TextInput, TextStyle, View, ViewStyle } from 'react-native';
import { ExclamationCircleIcon } from 'react-native-heroicons/outline';
import { getFromClipboard } from '@/utils/stringUtils';
import { commonStyles } from '../styles/inputStyles';
import Link from './Link';

interface InputProps {
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  width?: InputWidth;
  variant?: InputStyle;
  label?: string;
  disabled?: boolean;
  hint?: string;
  error?: string;
  style?: ViewStyle;
  testID?: string;
}

type IconElement = React.ReactElement<{ size?: number; color?: ColorValue }>;

const TextArea = forwardRef<TextInput, InputProps>(function Input(
  {
    value,
    setValue,
    width = 'screen',
    variant = 'stroke',
    label,
    disabled = false,
    placeholder = '',
    error,
    hint,
    style,
    testID,
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

  const handleFocus = useCallback(() => !disabled && setIsFocused(true), [disabled]);
  const handleBlur = useCallback(() => setIsFocused(false), []);
  useImperativeHandle(inputRef, () => innerRef.current as TextInput);

  const { textAreaStyles } = useTextAreaStyles();

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
      return React.cloneElement(icon as IconElement, { size: iconSize, color: iconColor });
    }
    return null;
  }, []);

  return (
    <View style={[textAreaStyles.container, style]}>
      {label && <Text style={textAreaStyles.label}>{label}</Text>}

      <View style={widthStyle}>
        <View style={[wrapperStyle, textAreaStyles.inputWrapper]}>
          <TextInput
            multiline
            ref={innerRef}
            style={[textAreaStyles.textInput, { flex: 1 }]}
            value={value}
            onChangeText={setValue}
            placeholder={placeholder ?? ''}
            placeholderTextColor={placeholderStyle.color}
            autoCapitalize="none"
            editable={!disabled}
            onFocus={handleFocus}
            onBlur={handleBlur}
            spellCheck={false}
            autoCorrect={false}
            textContentType="none"
            testID={testID}
          />
          {!value && (
            <View
              pointerEvents="box-none"
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                left: 7,
                top: 8,
                width: '100%',
                height: '100%',
              }}
            >
              <Link
                variant="accent"
                label="Paste"
                onPress={async () => {
                  const clipboard = await getFromClipboard();
                  setValue(prev => prev + (clipboard ?? ''));
                }}
              />
            </View>
          )}
          <View style={textAreaStyles.rightSection}>
            {derivedState === 'error' &&
              renderIcon(<ExclamationCircleIcon />, 20, (wrapperStyle as any).borderColor)}
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

export default TextArea;

const useTextAreaStyles = () => {
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
          position: 'absolute',
          top: 8,
          right: 10,
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          height: '100%',
          gap: 8,
        },
        textInput: {
          ...commonStyles.textInput,
          color: theme.text.primary,
          paddingRight: 26,
        },
        inputWrapper: {
          ...commonStyles.inputWrapper,
          flexDirection: 'row',
          alignItems: 'stretch',
          alignContent: 'stretch',
          height: 120,
          paddingLeft: 10,
          paddingRight: 4,
          paddingVertical: 8,
          borderRadius: 8,
        },
      }),
    [theme],
  );

  return { textAreaStyles };
};
