import { useButtonStyles } from '@/hooks/useButtonStyles';
import { typography } from '@/theme/typography';
import { ButtonSize, ButtonStyle as ButtonVariant, Icon } from '@/utils/types';
import type { BlurViewProps } from 'expo-blur';
import { BlurView } from 'expo-blur';
import type { LinearGradientProps } from 'expo-linear-gradient';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { ColorValue, Pressable, Text, TextStyle, View, type ViewProps } from 'react-native';
import LoaderIcon from '../icons/LoaderIcon';

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
  variant?: ButtonVariant;
  size?: ButtonSize | { width: number; height: number; fontSize?: number; iconSize?: number };
  onPress?: () => void;
  icon?: Icon;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  loading?: boolean;
  disabled?: boolean;
  invertedTheme?: boolean;
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
  variant = 'accent',
  size = 'M',
  onPress,
  icon,
  showLeftIcon,
  showRightIcon,
  loading = false,
  disabled = false,
  invertedTheme = false,
}) => {
  const { buttonStyles, getAccentGradientColors, getButtonTextColor, getStyles } =
    useButtonStyles(invertedTheme);

  const [pressed, setPressed] = useState<boolean>(false);

  const currentState = useMemo(() => {
    if (disabled) return 'disabled';
    if (loading) return 'loading';
    if (pressed) return 'pressed';
    return 'default';
  }, [disabled, loading, pressed]);

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

  const variantStyle = useMemo(
    () => getStyles(currentState, variant),
    [variant, currentState, getStyles],
  );

  const textColor = useMemo<ColorValue>(
    () => getButtonTextColor(currentState, variant),
    [variant, currentState, getButtonTextColor],
  );

  const flags = useMemo(() => {
    const needsBlur =
      ((variant === 'outline' || variant === 'ghost') && (loading || pressed)) ||
      (variant === 'tertiary' && !loading && !pressed && !disabled);
    const isAccent = variant === 'accent';
    return { needsBlur, isAccent };
  }, [variant, loading, disabled, pressed]);

  const wrapper = useMemo<Wrapper>(() => {
    if (flags.isAccent) {
      const props: Omit<LinearGradientProps, 'children'> = {
        colors: getAccentGradientColors(currentState),
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
        style: [buttonStyles.gradient, sizeStyle, variantStyle],
      };
      return { kind: 'gradient', props };
    }
    if (flags.needsBlur) {
      const props: Omit<BlurViewProps, 'children'> = {
        intensity: 20,
        style: [sizeStyle, buttonStyles.blurContainer, buttonStyles.button, variantStyle],
      };
      return { kind: 'blur', props };
    }
    const props: ViewProps = { style: [buttonStyles.button, sizeStyle, variantStyle] };
    return { kind: 'view', props };
  }, [
    flags.isAccent,
    flags.needsBlur,
    getAccentGradientColors,
    buttonStyles,
    sizeStyle,
    variantStyle,
  ]);

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={[buttonStyles.button, sizeStyle]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {wrapper.kind === 'gradient' ? (
        <LinearGradient {...wrapper.props}>
          <ButtonContents
            loading={loading}
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
            loading={loading}
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
            loading={loading}
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
  loading: boolean;
  icon?: Icon;
  iconSize: number;
  textStyles: TextStyle;
  textColor: ColorValue;
  label: string;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
}

const ButtonContents: React.FC<ButtonContentsProps> = ({
  loading,
  icon,
  iconSize,
  textStyles,
  textColor,
  label,
  showLeftIcon,
  showRightIcon,
}) => {
  const { buttonStyles } = useButtonStyles();

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
