import { BlurView } from 'expo-blur';
import { default as React, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';

interface ActionButtonProps {
    label: string;
    disabled?: boolean;
    loading?: boolean;
    onPress?: () => void;
    icon?: React.ReactNode;
}

const ActionButton: React.FC<ActionButtonProps> = ({
    label,
    disabled = false,
    loading = false,
    onPress,
    icon
}) => {
    const { theme } = useTheme();
    const styles = useActionButtonStyles();

    const [isPressed, setIsPressed] = useState(false);

    const getTextColor = () => {
        if (disabled) {
            return { color: theme.text.disabled };
        }
        return {
            color: theme.text.primary,
        }
    };

    const getActionButtonContent = () => {
        // this is the best way to handle the blur effect
        // without needing huge third party libraries
        const needsBlur = (loading || isPressed);
        if (needsBlur) {
            return (
                <BlurView intensity={20} style={[styles.button, styles.blurContainer]}>
                    <View style={styles.content}>
                        {React.cloneElement(icon as React.ReactElement<any>, {
                            size: 24,
                            style: 'outline',
                            color: getTextColor().color
                        })}
                        <Text style={[
                            typography.button.xsToL,
                            getTextColor(),
                        ]}>
                            {label}
                        </Text>
                    </View>
                </BlurView>
            );
        }
        return (
            <View style={[styles.button]}>
                <View style={styles.content}>
                    {React.cloneElement(icon as React.ReactElement<any>, {
                        size: 24,
                        style: 'outline',
                        color: getTextColor().color
                    })}
                    <Text style={[
                        typography.button.xsToL,
                        getTextColor(),
                    ]}>
                        {label}
                    </Text>
                </View>
            </View>
        );
    };


    const getActionButtonStyle = () => {
        return [styles.button, loading ? styles.loading : disabled ? styles.disabled : isPressed ? styles.pressed : styles.default];
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={getActionButtonStyle()}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
        >
            {getActionButtonContent()}
        </Pressable>
    );
};

const useActionButtonStyles = () => {
    const { theme } = useTheme();

    return useMemo(() => StyleSheet.create({
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
            color: theme.text.inverted
        },
        loading: {
            backgroundColor: theme.button.tertiary.loading,
            color: theme.text.inverted
        },
        pressed: {
            backgroundColor: theme.button.tertiary.pressed,
            color: theme.text.inverted
        },
        disabled: {
            backgroundColor: theme.button.tertiary.disabled,
            color: theme.text.disabled
        },
    }), [theme]);
};
export default ActionButton;