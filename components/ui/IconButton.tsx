import { useButtonStyles } from '@/hooks/useButtonStyles';
import {
  ButtonState,
  ButtonStyle,
  Icon,
  IconButtonSize,
  SelectableButtonState,
} from '@/utils/types';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { ColorValue, Pressable, View } from 'react-native';

interface IconButtonProps {
  state?: SelectableButtonState;
  style?: ButtonStyle;
  size?: IconButtonSize;
  onPress?: () => void;
  icon: Icon;
}

const ICON_SIZE_STYLES = {
  XS: { width: 16, height: 16, iconSize: 16, iconStyle: 'micro' },
  S: { width: 32, height: 32, iconSize: 16, iconStyle: 'micro' },
  M: { width: 40, height: 40, iconSize: 20, iconStyle: 'outline' },
  L: { width: 48, height: 48, iconSize: 24, iconStyle: 'outline' },
} as const;

type PresetKey = keyof typeof ICON_SIZE_STYLES;

const IconButton: React.FC<IconButtonProps> = ({
  state = 'default',
  style = 'accent',
  size = 'M',
  onPress,
  icon,
}) => {
  const { buttonStyles, getAccentGradientColors, getButtonTextColor, getStyles } =
    useButtonStyles();
  const [currentState, setCurrentState] = useState<ButtonState>(state as ButtonState);

  const { sizeStyle, iconSize, iconStyle } = useMemo(() => {
    const key = (size as PresetKey) in ICON_SIZE_STYLES ? (size as PresetKey) : ('M' as PresetKey);
    const preset = ICON_SIZE_STYLES[key];
    return {
      sizeKey: key,
      sizeStyle: {
        width: preset.width,
        height: preset.height,
        paddingHorizontal: 8,
        paddingVertical: 4,
      },
      iconSize: preset.iconSize,
      iconStyle: preset.iconStyle,
    };
  }, [size]);

  const variant = style;

  const variantStyle = useMemo(
    () => getStyles(currentState, variant),
    [currentState, variant, getStyles],
  );

  const textColor = useMemo<ColorValue>(
    () => getButtonTextColor(currentState, variant),
    [currentState, variant, getButtonTextColor],
  );

  const flags = useMemo(() => {
    const loading = currentState === 'loading';
    const pressed = currentState === 'pressed';
    const disabled = currentState === 'disabled';
    const needsBlur = (variant === 'outline' || variant === 'ghost') && (loading || pressed);
    const isAccent = variant === 'accent';
    return { loading, pressed, disabled, needsBlur, isAccent };
  }, [currentState, variant]);

  const wrapper = useMemo(() => {
    if (flags.isAccent) {
      return {
        Component: LinearGradient as React.ComponentType<any>,
        props: {
          colors: getAccentGradientColors(currentState),
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
          style: [buttonStyles.gradient, sizeStyle, variantStyle],
        },
      };
    }
    if (flags.needsBlur) {
      return {
        Component: BlurView as React.ComponentType<any>,
        props: {
          intensity: 20,
          style: [sizeStyle, buttonStyles.blurContainer, buttonStyles.button, variantStyle],
        },
      };
    }
    return {
      Component: View as React.ComponentType<any>,
      props: { style: [buttonStyles.button, sizeStyle, variantStyle] },
    };
  }, [
    flags.isAccent,
    flags.needsBlur,
    currentState,
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
      onPressIn={() => setCurrentState('pressed')}
      onPressOut={() => setCurrentState('default')}
    >
      <wrapper.Component {...wrapper.props}>
        <IconButtonContents
          state={currentState}
          icon={icon}
          iconSize={iconSize}
          iconStyle={iconStyle}
          textColor={textColor}
        />
      </wrapper.Component>
    </Pressable>
  );
};

interface IconButtonContentsProps {
  state: ButtonState;
  icon: Icon;
  iconSize: number;
  iconStyle: string;
  textColor: ColorValue;
}

const IconButtonContents: React.FC<IconButtonContentsProps> = ({
  state,
  icon,
  iconSize,
  iconStyle,
  textColor,
}) => {
  const { buttonStyles } = useButtonStyles();
  // Optionally, you can add a loader here if you want to show loading state

  return (
    <View style={buttonStyles.content}>
      {React.cloneElement(icon as React.ReactElement<any>, {
        size: iconSize,
        style: iconStyle,
        color: textColor,
      })}
    </View>
  );
};

export default IconButton;
