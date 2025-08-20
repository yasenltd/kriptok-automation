import { useTheme } from '@/context/ThemeContext';
import { typography } from '@/theme/typography';
import { BlurView } from 'expo-blur';
import { default as React, useCallback, useMemo, useState } from 'react';
import { ColorValue, Pressable, StyleSheet, Text, View } from 'react-native';
import { Icon } from '../../utils/types';

interface ActionButtonProps {
  label: string;
  onPress?: () => void;
  icon?: Icon;
  disabled?: boolean;
  loading?: boolean;
}

interface ActionButtonContentsProps {
  label: string;
  textColor: ColorValue;
  icon?: Icon;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  onPress,
  icon,
  loading = false,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles = useActionButtonStyles();
  const [pressed, setPressed] = useState<boolean>(false);

  const currentState = useMemo(() => {
    if (disabled) return 'disabled';
    if (loading) return 'loading';
    if (pressed) return 'pressed';
    return 'default';
  }, [disabled, loading, pressed]);

  const textColor = useMemo(() => {
    return currentState === 'disabled' ? theme.text.disabled : theme.text.primary;
  }, [currentState, theme]);

  const isDisabled = useMemo(() => {
    return currentState === 'disabled' || currentState === 'loading';
  }, [currentState]);

  const getActionButtonContent = useCallback(() => {
    const needsBlur = loading || pressed;
    if (needsBlur) {
      return (
        <BlurView intensity={20} style={[styles.button, styles.blurContainer]}>
          <ActionButtonContents label={label} textColor={textColor} icon={icon} />
        </BlurView>
      );
    }
    return (
      <View style={[styles.button]}>
        <ActionButtonContents label={label} textColor={textColor} icon={icon} />
      </View>
    );
  }, [loading, pressed, label, textColor, icon]);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.button, styles[currentState]]}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
    >
      {getActionButtonContent()}
    </Pressable>
  );
};

const ActionButtonContents: React.FC<ActionButtonContentsProps> = ({ label, textColor, icon }) => {
  const styles = useActionButtonStyles();
  return (
    <View style={styles.content}>
      {React.cloneElement(icon as React.ReactElement<any>, {
        size: 24,
        style: 'outline',
        color: textColor,
      })}
      <Text style={[typography.button.xsToL, { color: textColor }]}>{label}</Text>
    </View>
  );
};

const useActionButtonStyles = () => {
  const { theme } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        button: {
          borderRadius: 9999,
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          width: 110,
          height: 64,
          paddingHorizontal: 24,
          paddingVertical: 12,
        },
        content: {
          width: 110,
          height: 64,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        },
        blurContainer: {
          borderRadius: 9999,
          overflow: 'hidden',
        },
        default: {
          backgroundColor: theme.button.tertiary.default,
          color: theme.text.inverted,
        },
        loading: {
          backgroundColor: theme.button.tertiary.loading,
          color: theme.text.inverted,
        },
        pressed: {
          backgroundColor: theme.button.tertiary.pressed,
          color: theme.text.inverted,
        },
        disabled: {
          backgroundColor: theme.button.tertiary.disabled,
          color: theme.text.disabled,
        },
      }),
    [theme],
  );
};
export default ActionButton;
