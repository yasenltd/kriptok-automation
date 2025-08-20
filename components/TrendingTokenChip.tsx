import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { Icon } from '../utils/types';
import IconOrImage from './ui/IconOrImage';
import TrendingDirection from './ui/TrendingDirection';

interface TrendingTokenChipProps {
  label: string;
  change: number;
  icon?: Icon | string;
  style?: ViewStyle;
}

const TrendingTokenChip = ({ label, change, icon, style }: TrendingTokenChipProps) => {
  const { styles } = useTrendingTokenChipStyles();
  return (
    <View style={[styles.container, style]}>
      <View style={styles.tokenContainer}>
        {icon && <IconOrImage icon={icon} size={20} color={styles.label.color} />}
        <Text style={styles.label}>{label}</Text>
      </View>
      <TrendingDirection percentageChange={change} />
    </View>
  );
};

const useTrendingTokenChipStyles = () => {
  const { theme } = useTheme();

  return {
    styles: StyleSheet.create({
      container: {
        flexDirection: 'column',
        alignContent: 'center',
        alignItems: 'center',
        padding: 6,
        gap: 6,
        borderRadius: 8,
        backgroundColor: colors.grey.opacity[10],
      },
      tokenContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 6,
      },
      label: {
        color: theme.text.primary,
        ...typography.tokenChip,
      },
    }),
  };
};

export default TrendingTokenChip;
