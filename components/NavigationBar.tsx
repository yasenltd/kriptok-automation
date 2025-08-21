import CurrencyTryIcon from '@/components/icons/CurrencyTryIcon';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/theme/colors';
import { BlurView } from 'expo-blur';
import { router, usePathname } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowsUpDownIcon, GlobeEuropeAfricaIcon, WalletIcon } from 'react-native-heroicons/mini';

type NavigationItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  comingSoon?: boolean;
  onPress: () => void;
};

const defaultNavigationItems: NavigationItem[] = [
  { key: 'assets', label: 'Assets', icon: <WalletIcon />, onPress: () => router.push('/assets') },
  {
    key: 'activity',
    label: 'Activity',
    icon: <ArrowsUpDownIcon />,
    onPress: () => router.push('/activity'),
  },
  {
    key: 'browse',
    label: 'Browse',
    icon: <GlobeEuropeAfricaIcon />,
    onPress: () => router.push('/browse'),
  },
  {
    key: 'earned',
    label: 'Earned',
    icon: <CurrencyTryIcon />,
    onPress: () => router.push('/earned'),
    comingSoon: true,
  },
];

interface NavigationBarProps {
  items?: [NavigationItem, ...NavigationItem[]];
  style?: any;
}

const NavigationBar: React.FC<NavigationBarProps> = ({
  items = defaultNavigationItems,
  style = { position: 'absolute', bottom: 0, left: 0, right: 0 },
}) => {
  const pathname = usePathname();
  const { styles } = useNavigationBarStyles();
  const memoizedItems = useMemo(() => items, [items]);

  const isActive = useCallback(
    (path: string) => {
      return pathname === '/' + path;
    },
    [pathname],
  );

  const renderIcon = useCallback(
    (icon: React.ReactNode, isActive: boolean) => {
      if (!icon || !React.isValidElement(icon)) return null;
      return React.cloneElement(icon as React.ReactElement<any>, {
        size: 20,
        color: isActive ? styles.labelActive.color : styles.label.color,
      });
    },
    [styles.labelActive.color, styles.label.color],
  );

  const handlePress = useCallback((item: NavigationItem, index: number) => {
    if (item.comingSoon) return;
    item.onPress();
  }, []);

  return (
    <BlurView intensity={25} style={[styles.blurContainer, style]}>
      <View style={styles.container}>
        {memoizedItems.map((item: NavigationItem, index) => (
          <Pressable key={index} style={styles.item} onPress={() => handlePress(item, index)}>
            {renderIcon(item.icon, isActive(item.key))}
            <Text style={isActive(item.key) ? styles.labelActive : styles.label}>{item.label}</Text>
            {item.comingSoon && <ComingSoonLabel />}
          </Pressable>
        ))}
      </View>
    </BlurView>
  );
};

const useNavigationBarStyles = () => {
  const { theme } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          height: 76,
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignContent: 'flex-start',
          alignItems: 'flex-start',
          paddingVertical: 12,
          paddingHorizontal: 32,
          boxShadow: [
            {
              offsetX: 0,
              offsetY: -5,
              blurRadius: 20,
              spreadDistance: 0,
              color: '#05050540',
            },
          ],
          backgroundColor: theme.navlink.background,
        },
        blurContainer: {
          justifyContent: 'center',
          overflow: 'hidden',
        },
        item: {
          paddingVertical: 4,
          paddingHorizontal: 8,
          alignItems: 'center',
          gap: 2,
          height: 52,
        },
        label: {
          fontFamily: 'Satoshi-Regular',
          fontWeight: '400',
          fontSize: 12,
          color: theme.navlink.inactive,
          lineHeight: 16,
        },
        labelActive: {
          fontFamily: 'Satoshi-Regular',
          fontWeight: '400',
          fontSize: 12,
          color: theme.navlink.active,
          lineHeight: 16,
        },
      }),
    [theme],
  );
  return { styles };
};

const ComingSoonLabel: React.FC = () => {
  const { styles } = useComingSoonLabelStyles();
  return (
    <BlurView intensity={10} style={styles.blurContainer}>
      <View style={styles.container}>
        <Text style={styles.text}>Coming</Text>
      </View>
    </BlurView>
  );
};

const useComingSoonLabelStyles = () => {
  const { theme } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        container: {
          width: 48,
          height: 16,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.grey.opacity[50],
        },
        blurContainer: {
          borderRadius: 9999,
          overflow: 'hidden',
          width: 48,
          height: 16,
          justifyContent: 'center',
          alignItems: 'center',
        },
        text: {
          fontSize: 10,
          lineHeight: 15.6,
          color: theme.navlink.active,
        },
      }),
    [theme],
  );
  return { styles };
};

export default NavigationBar;
