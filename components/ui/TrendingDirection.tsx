import { BlurView } from 'expo-blur';
import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon } from 'react-native-heroicons/outline';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

interface TrendingDirectionProps {
  percentageChange: number;
  price?: number;
}

const TrendingDirection = ({ percentageChange }: TrendingDirectionProps) => {
  const isPositive = percentageChange >= 0;
  const { style, getTextStyle, getContainerStyle } = useTrendingDirectionStyles();

  const textStyle = useMemo(() => getTextStyle(isPositive), [isPositive]);
  const containerStyle = useMemo(() => getContainerStyle(isPositive), [isPositive]);

  return (
    <BlurView intensity={20} style={style.blurContainer}>
      <View style={containerStyle}>
        {isPositive ? (
          <ArrowTrendingUpIcon size={20} color={textStyle.color} />
        ) : (
          <ArrowTrendingDownIcon size={20} color={textStyle.color} />
        )}
        <Text style={textStyle}>
          {isPositive ? '+' : ''}
          {percentageChange}%
        </Text>
      </View>
    </BlurView>
  );
};

const useTrendingDirectionStyles = () => {
  const { theme } = useTheme();

  const textStyle = StyleSheet.create({
    positive: {
      color: theme.text.success,
    },
    negative: {
      color: theme.text.error,
    },
  });

  const style = StyleSheet.create({
    text: {
      ...typography.trendingDirection,
    },
    blurContainer: {
      height: 20,
      borderRadius: 12,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 6,
      paddingVertical: 2,
      gap: 4,
      borderRadius: 12,
    },
  });

  const getTextStyle = (isPositive: boolean) => {
    return isPositive ? textStyle.positive : textStyle.negative;
  };

  const getContainerStyle = (isPositive: boolean) => {
    return {
      ...style.container,
      backgroundColor: isPositive ? colors.success.opacity[50] : colors.error.opacity[50],
    };
  };

  return {
    style: style,
    getTextStyle,
    getContainerStyle,
  };
};

export default TrendingDirection;
