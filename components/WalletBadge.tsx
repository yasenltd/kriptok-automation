import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import { Icon } from '../utils/types';
import IconOrImage from './ui/IconOrImage';

interface WalletBadgeProps {
  icon: Icon | string | number;
  label: string;
  onPress: () => void;
}

const WalletBadge: React.FC<WalletBadgeProps> = ({ icon, label, onPress }) => {
  const styles = useWalletBadgeStyles();

  return (
    <Pressable onPress={onPress}>
      <View style={styles.badge}>
        <IconOrImage icon={icon} size={24} />
        <Text style={styles.label}>{label}</Text>
      </View>
    </Pressable>
  );
};

const useWalletBadgeStyles = () => {
  const { theme } = useTheme();

  return StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      flexGrow: 0,
      paddingHorizontal: 10,
      paddingVertical: 12,
      gap: 8,
      borderRadius: 9999,
      backgroundColor: colors.grey.opacity[50],
    },

    label: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '500',
      fontFamily: 'Satoshi-Medium',
      color: theme.text.primary,
    },
  });
};

export default WalletBadge;
