import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Icon } from '../../utils/types';

interface BadgeProps {
  label: string;
  icon?: Icon;
  size?: 'small' | 'regular';
}

const Badge = ({ label, icon, size = 'regular' }: BadgeProps) => {
  const { getTextStyle, style } = useTrendingDirectionStyles();
  const textStyle = useMemo(() => getTextStyle(size), [getTextStyle, size]);

  return (
    <View style={style.container}>
      {icon &&
        React.isValidElement(icon) &&
        React.cloneElement(icon as React.ReactElement<Icon>, {
          size: size === 'small' ? 12 : 16,
          color: textStyle.color,
        })}
      <Text style={textStyle}>{label}</Text>
    </View>
  );
};

const useTrendingDirectionStyles = () => {
  const { theme } = useTheme();

  const textStyle = StyleSheet.create({
    small: {
      ...typography.badge.small,
      color: theme.text.secondary,
    },
    regular: {
      ...typography.badge.regular,
      color: theme.text.secondary,
    },
  });

  const style = StyleSheet.create({
    container: {
      height: 20,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 4,
      gap: 4,
      backgroundColor: colors.grey.opacity[50],
    },
  });

  const getTextStyle = (size: 'small' | 'regular') => {
    return textStyle[size];
  };

  return {
    style,
    textStyle,
    getTextStyle,
  };
};

export default Badge;
