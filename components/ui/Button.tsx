import { useButtonStyles } from '@/hooks/useButtonStyles';
import { typography } from '@/theme/typography';
import { ButtonSize, ButtonState, ButtonStyle, Icon, SelectableButtonState } from '@/utils/types';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { ColorValue, Pressable, Text, TextStyle, View, type ViewProps } from 'react-native';
import LoaderIcon from '../icons/LoaderIcon';
import type { BlurViewProps } from 'expo-blur';
import type { LinearGradientProps } from 'expo-linear-gradient';

type GradientWrapper = {
  kind: 'gradient';
  props: Omit<LinearGradientProps, 'children'>;
};
type BlurWrapper = {
  kind: 'blur';
  props: Omit<BlurViewProps, 'children'>;
};
type ViewWrapper = {
  kind: 'view';
  props: ViewProps;
};

type Wrapper = GradientWrapper | BlurWrapper | ViewWrapper;

interface ButtonProps {
  label: string;
  state?: SelectableButtonState;
  style?: ButtonStyle;
  size?: ButtonSize | { width: number; height: number; fontSize?: number; iconSize?: number };
  onPress?: () => void;
  icon?: Icon;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  isReverted?: boolean;
}

type CustomSize = { width: number; height: number; fontSize?: number; iconSize?: number };
const isCustomSize = (s: ButtonProps['size']): s is CustomSize =>
  typeof s === 'object' && s !== null && 'width' in s && 'height' in s;

const PRESET_SIZES = {
  XS: { width: 99, height: 20, paddingHorizontal: 8, paddingVertical: 4 },
  M: { width: 140, height: 40, paddingHorizontal: 8, paddingVertical: 4 },
  L: { width: 160, height: 44, paddingHorizontal: 8, paddingVertical: 8 },
  XL: { width: 184, height: 52, paddingHorizontal: 8, paddingVertical: 12 },
  screen: { width: '100%', height: 40, paddingHorizontal: 8, paddingVertical: 4 },
} as const;

type PresetKey = keyof typeof PRESET_SIZES;

const TEXT_STYLES: Record<PresetKey, TextStyle> = {
  XS: typography.button.xsToL,
  M: typography.button.xsToL,
  L: typography.button.xsToL,
  XL: typography.button.xl,
  screen: typography.button.xsToL,
};

const Button: React.FC<ButtonProps> = ({
  label = '',
  state = 'default',
  style = 'accent',
  size = 'M',
  onPress,
  icon,
  showLeftIcon,
  showRightIcon,
  isReverted,
}) => {
  const { buttonStyles, getAccentGradientColors, getButtonTextColor, getStyles } =
    useButtonStyles();

  const [isPressed, setIsPressed] = useState(false);

  const { sizeStyle, textStyles, iconSize } = useMemo(() => {
    if (isCustomSize(size)) {
      const baseText = TEXT_STYLES.M;
      const fontSize = size.fontSize ?? (baseText.fontSize as number | undefined);
      const iconSize = size.iconSize ?? fontSize ?? 16;
      return {
        sizeKey: 'M' as PresetKey,
        sizeStyle: {
          width: size.width,
          height: size.height,
          paddingHorizontal: 8,
          paddingVertical: 4,
        },
        textStyles: fontSize ? { ...baseText, fontSize } : baseText,
        iconSize,
      };
    }
    const key = (size as PresetKey) in PRESET_SIZES ? (size as PresetKey) : ('M' as PresetKey);
    const text = TEXT_STYLES[key];
    const icon = (text.fontSize as number | undefined) ?? 16;
    return { sizeKey: key, sizeStyle: PRESET_SIZES[key], textStyles: text, iconSize: icon };
  }, [size]);

  const variant = style;

  const isDisabled = state === 'disabled' || state === 'loading';
  const effectiveState: ButtonState = isDisabled
    ? (state as ButtonState)
    : isPressed
      ? 'pressed'
      : 'default';

  const variantStyle = useMemo(
    () => getStyles(effectiveState, variant),
    [effectiveState, variant, getStyles],
  );

  const textColor = useMemo<ColorValue>(
    () => getButtonTextColor(effectiveState, variant),
    [effectiveState, variant, getButtonTextColor],
  );

  const flags = useMemo(() => {
    const loading = effectiveState === 'loading';
    const pressed = effectiveState === 'pressed';
    const disabled = effectiveState === 'disabled';
    const isDefault = effectiveState === 'default';
    const needsBlur =
      ((variant === 'outline' || variant === 'ghost') && (loading || pressed)) ||
      (variant === 'tertiary' && isDefault);
    const isAccent = variant === 'accent';
    return { loading, pressed, disabled, needsBlur, isAccent };
  }, [effectiveState, variant]);

  const wrapper = useMemo<Wrapper>(() => {
    if (flags.isAccent) {
      const props: Omit<LinearGradientProps, 'children'> = {
        colors: getAccentGradientColors(effectiveState),
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        style: [buttonStyles.gradient, sizeStyle, variantStyle],
      };
      return { kind: 'gradient', props };
    }
    if (flags.needsBlur) {
      const props: Omit<BlurViewProps, 'children'> = {
        intensity: 20,
        style: [sizeStyle, buttonStyles.blurContainer],
      };
      return { kind: 'blur', props };
    }
    const props: ViewProps = { style: [buttonStyles.button, sizeStyle, variantStyle] };
    return { kind: 'view', props };
  }, [
    flags.isAccent,
    flags.needsBlur,
    effectiveState,
    getAccentGradientColors,
    buttonStyles,
    sizeStyle,
    variantStyle,
  ]);

  return (
    <Pressable
      onPress={onPress}
      disabled={flags.disabled || flags.loading}
      style={[buttonStyles.button, sizeStyle]}
      onPressIn={() => {
        if (!isDisabled) setIsPressed(true);
      }}
      onPressOut={() => setIsPressed(false)}
    >
      {wrapper.kind === 'gradient' ? (
        <LinearGradient {...wrapper.props}>
          <ButtonContents
            state={effectiveState}
            icon={icon}
            iconSize={iconSize}
            textStyles={textStyles}
            textColor={textColor}
            label={label}
            showLeftIcon={showLeftIcon}
            showRightIcon={showRightIcon}
          />
        </LinearGradient>
      ) : wrapper.kind === 'blur' ? (
        <BlurView {...wrapper.props}>
          <ButtonContents
            state={effectiveState}
            icon={icon}
            iconSize={iconSize}
            textStyles={textStyles}
            textColor={textColor}
            label={label}
            showLeftIcon={showLeftIcon}
            showRightIcon={showRightIcon}
          />
        </BlurView>
      ) : (
        <View {...wrapper.props}>
          <ButtonContents
            state={effectiveState}
            icon={icon}
            iconSize={iconSize}
            textStyles={textStyles}
            textColor={textColor}
            label={label}
            showLeftIcon={showLeftIcon}
            showRightIcon={showRightIcon}
          />
        </View>
      )}
    </Pressable>
  );
};

interface ButtonContentsProps {
  state: ButtonState;
  icon?: Icon;
  iconSize: number;
  textStyles: TextStyle;
  textColor: ColorValue;
  label: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
}

const ButtonContents: React.FC<ButtonContentsProps> = ({
  state,
  icon,
  iconSize,
  textStyles,
  textColor,
  label,
  showLeftIcon,
  showRightIcon,
}) => {
  const { buttonStyles } = useButtonStyles();
  const loading = state === 'loading';

  const renderIcon = (visible?: boolean) => {
    if (!visible) return null;
    if (loading) return <LoaderIcon size={iconSize} color={textColor} />;
    if (icon && React.isValidElement(icon)) {
      return React.cloneElement(icon as React.ReactElement<any>, {
        size: iconSize,
        color: textColor,
      });
    }
    return null;
  };

  return (
    <View style={buttonStyles.content}>
      {renderIcon(showLeftIcon)}
      <Text style={[textStyles, { color: textColor }]}>{label}</Text>
      {renderIcon(showRightIcon)}
    </View>
  );
};

export default Button;
