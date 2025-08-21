import { useButtonStyles } from '@/hooks/useButtonStyles';
import { ButtonVariant, Icon, IconButtonSize, Wrapper } from '@/utils/types';
import { BlurView, BlurViewProps } from 'expo-blur';
import { LinearGradient, LinearGradientProps } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { ColorValue, Pressable, View, ViewProps } from 'react-native';
import { IconElement } from './ActionButton';

interface IconButtonProps {
  variant?: ButtonVariant;
  size?: IconButtonSize;
  onPress?: () => void;
  icon: Icon;
  loading?: boolean;
  disabled?: boolean;
}

const ICON_SIZE_STYLES = {
  XS: { width: 16, height: 16, iconSize: 16, iconStyle: 'micro' },
  S: { width: 32, height: 32, iconSize: 16, iconStyle: 'micro' },
  M: { width: 40, height: 40, iconSize: 20, iconStyle: 'outline' },
  L: { width: 48, height: 48, iconSize: 24, iconStyle: 'outline' },
} as const;

type PresetKey = keyof typeof ICON_SIZE_STYLES;

const IconButton: React.FC<IconButtonProps> = ({
  variant = 'accent',
  size = 'M',
  onPress,
  icon,
  loading = false,
  disabled = false,
}) => {
  const { buttonStyles, getAccentGradientColors, getButtonTextColor, getStyles } =
    useButtonStyles();

  const [pressed, setPressed] = useState<boolean>(false);

  const currentState = useMemo(() => {
    if (disabled) return 'disabled';
    if (loading) return 'loading';
    if (pressed) return 'pressed';
    return 'default';
  }, [disabled, loading, pressed]);

  const { sizeStyle, iconSize, iconStyle } = useMemo(() => {
    const key = (size as PresetKey) in ICON_SIZE_STYLES ? (size as PresetKey) : ('M' as PresetKey);
    const preset = ICON_SIZE_STYLES[key];
    return {
      sizeKey: key,
      sizeStyle: {
        width: preset.width,
        height: preset.height,
      },
      iconSize: preset.iconSize,
      iconStyle: preset.iconStyle,
    };
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
          <IconButtonContents
            icon={icon}
            iconSize={iconSize}
            iconStyle={iconStyle}
            textColor={textColor}
          />
        </LinearGradient>
      ) : wrapper.kind === 'blur' ? (
        <BlurView {...wrapper.props}>
          <IconButtonContents
            icon={icon}
            iconSize={iconSize}
            iconStyle={iconStyle}
            textColor={textColor}
          />
        </BlurView>
      ) : (
        <View {...wrapper.props}>
          <IconButtonContents
            icon={icon}
            iconSize={iconSize}
            iconStyle={iconStyle}
            textColor={textColor}
          />
        </View>
      )}
    </Pressable>
  );
};

interface IconButtonContentsProps {
  icon: Icon;
  iconSize: number;
  iconStyle: string;
  textColor: ColorValue;
}

const IconButtonContents: React.FC<IconButtonContentsProps> = ({
  icon,
  iconSize,
  iconStyle,
  textColor,
}) => {
  const { buttonStyles } = useButtonStyles();
  return (
    <View style={buttonStyles.content}>
      {React.cloneElement(icon as IconElement, {
        size: iconSize,
        style: iconStyle,
        color: textColor,
      })}
    </View>
  );
};

export default IconButton;
