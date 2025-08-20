import { BlurView } from 'expo-blur';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { ChevronRightIcon, WalletIcon } from 'react-native-heroicons/outline';
import { useTheme } from '../context/ThemeContext';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import IconButton from './ui/IconButton';

interface WalletItemProps {
  label: string;
  address: string;
  onPress?: () => void;
  style?: ViewStyle;
}

const WalletItem: React.FC<WalletItemProps> = ({ label, address, onPress, style: outerStyle }) => {
  const { styles } = useWalletItemStyles();
  return (
    <Pressable onPress={onPress} style={outerStyle}>
      <View style={styles.container}>
        <BlurView intensity={10} style={styles.iconContainer}>
          <View style={styles.iconContainer}>
            <WalletIcon size={24} color={styles.icon.color} />
          </View>
        </BlurView>
        <View style={styles.walletDetails}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.address}>{address}</Text>
        </View>
        <IconButton variant="ghost" size="M" icon={<ChevronRightIcon />}></IconButton>
      </View>
    </Pressable>
  );
};

const useWalletItemStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexShrink: 0,
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
      gap: 12,
      backgroundColor: theme.surface.tertiary,
    },
    iconContainer: {
      borderRadius: 9999,
      borderColor: theme.stroke.secondary,
      borderWidth: 1,
      backgroundColor: colors.grey[100],
      width: 40,
      height: 40,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      color: theme.text.primary,
    },
    walletDetails: {
      flexGrow: 1,
      flexShrink: 0,
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    label: {
      ...typography.walletItem.label,
      color: theme.text.primary,
    },
    address: {
      ...typography.walletItem.address,
      color: theme.text.tertiary,
    },
  });

  return { styles };
};

export default WalletItem;
