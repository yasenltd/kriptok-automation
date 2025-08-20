import { BlurView } from 'expo-blur';
import { StyleSheet, Text, View } from 'react-native';
import { XMarkIcon } from 'react-native-heroicons/micro';
import { LockClosedIcon } from 'react-native-heroicons/outline';
import { useTheme } from '../../context/ThemeContext';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { Icon } from '../../utils/types';
import IconOrImage from './IconOrImage';
import Link from './Link';

interface FocusNoteProps {
  title: string;
  description: string;
  icon?: Icon | string | number;
  onClose: () => void;
}

const FocusNote = ({ title, description, icon = <LockClosedIcon />, onClose }: FocusNoteProps) => {
  const { styles } = useFocusNoteStyles();
  return (
    <View style={styles.container}>
      <BlurView intensity={10} style={styles.iconContainer}>
        <View style={styles.iconContainer}>
          {icon && <IconOrImage icon={icon} size={24} color={styles.icon.color} />}
        </View>
      </BlurView>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.closeIconContainer}>
        <Link
          variant="secondary"
          size="S"
          icon={<XMarkIcon />}
          showLeftIcon
          onPress={onClose}
        ></Link>
      </View>
    </View>
  );
};

const useFocusNoteStyles = () => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 8,
      borderRadius: 12,
      borderColor: theme.stroke.secondary,
      borderWidth: 1,
      backgroundColor: colors.grey[90],
      boxShadow: [
        { offsetX: 0, offsetY: 0, blurRadius: 5, spreadDistance: 0, color: '#99BBF5', inset: true },
        {
          offsetX: 1,
          offsetY: 1,
          blurRadius: 20,
          spreadDistance: 0,
          color: colors.white.opacity[25],
          inset: true,
        },
        {
          offsetX: 1,
          offsetY: 1,
          blurRadius: 20,
          spreadDistance: 0,
          color: '#99BBF540',
          inset: true,
        },
        {
          offsetX: 0,
          offsetY: 4,
          blurRadius: 10,
          spreadDistance: 0,
          color: '#99BBF51A',
          inset: true,
        },
      ],
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
    closeIconContainer: {
      position: 'absolute',
      top: 8,
      right: 8,
      width: 16,
      height: 16,
      flexDirection: 'column',
      //   justifyContent: 'flex-start',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
    },
    closeIcon: {
      color: theme.text.primary,
    },
    textContainer: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      gap: 2,
    },
    title: {
      ...typography.focusNote.title,
      color: theme.text.primary,
    },
    description: {
      ...typography.focusNote.description,
      color: theme.text.primary,
    },
  });

  return { styles };
};

export default FocusNote;
