import { typography } from '@/theme/typography';
import { Icon, LinkSize, LinkState, LinkVariant } from '@/utils/types';
import React, { useCallback, useMemo, useState } from 'react';
import { ColorValue, Pressable, StyleSheet, Text, TextStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface LinkProps {
  label?: string;
  variant?: LinkVariant;
  size?: LinkSize;
  onPress?: () => void;
  icon?: Icon;
  showLeftIcon?: boolean;
  showRightIcon?: boolean;
  disabled?: boolean;
}

const TEXT_STYLES: Record<LinkSize, TextStyle> = {
  S: typography.button.xsToL,
  L: typography.button.xl,
};

const Link: React.FC<LinkProps> = ({
  label,
  variant = 'accent',
  size = 'L',
  onPress,
  icon,
  showLeftIcon,
  showRightIcon,
  disabled = false,
}) => {
  const { linkStyles, getLinkTextColor } = useLinkStyles();
  const [pressed, setPressed] = useState(false);

  const currentState = useMemo(() => {
    if (disabled) return 'disabled';
    if (pressed) return 'pressed';
    return 'default';
  }, [disabled, pressed]);

  const textStyle = useMemo<TextStyle>(() => {
    const text = TEXT_STYLES[size];
    const color = getLinkTextColor(currentState, variant);
    return { ...text, color, textAlignVertical: 'center', height: '100%' };
  }, [currentState]);

  const renderIcon = useCallback(
    (visible?: boolean) => {
      if (!visible) return null;
      if (icon && React.isValidElement(icon)) {
        return React.cloneElement(icon as React.ReactElement<any>, {
          size: 20,
          color: textStyle.color,
        });
      }
      return null;
    },
    [textStyle.color],
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[linkStyles.link]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {renderIcon(showLeftIcon)}
      {label && <Text style={textStyle}>{label}</Text>}
      {renderIcon(showRightIcon)}
    </Pressable>
  );
};

export default Link;

export const useLinkStyles = () => {
  const { theme } = useTheme();

  const linkStyles = StyleSheet.create({
    link: {
      flexDirection: 'row',
      gap: 4,
      justifyContent: 'center',
      alignItems: 'center',
      textAlignVertical: 'center',
    },
  });

  const accentStyles = StyleSheet.create({
    default: {
      color: theme.link.primary.default,
    },
    pressed: {
      color: theme.link.primary.pressed,
    },
    disabled: {
      color: theme.link.primary.disabled,
    },
  });

  const secondaryStyles = StyleSheet.create({
    default: {
      color: theme.link.secondary.default,
    },
    pressed: {
      color: theme.link.secondary.pressed,
    },
    disabled: {
      color: theme.link.primary.disabled,
    },
  });

  const createStyles = StyleSheet.create({
    default: {
      color: theme.link.create.default,
    },
    pressed: {
      color: theme.link.create.pressed,
    },
    disabled: {
      color: theme.link.create.disabled,
    },
  });

  const destructStyles = StyleSheet.create({
    default: {
      color: theme.link.destruct.default,
    },
    pressed: {
      color: theme.link.destruct.pressed,
    },
    disabled: {
      color: theme.link.destruct.disabled,
    },
  });

  const getLinkTextColor: (state: LinkState, style: LinkVariant) => ColorValue = (state, style) => {
    return textColorStyles[style][state].color;
  };

  const textColorStyles = {
    accent: accentStyles,
    secondary: secondaryStyles,
    create: createStyles,
    destruct: destructStyles,
  };

  return {
    linkStyles: linkStyles,
    textColorStyles,
    getLinkTextColor,
  };
};
