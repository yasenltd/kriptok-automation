import { BlurView } from 'expo-blur';
import { default as React, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../theme/theme';
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
    const [isPressed, setIsPressed] = useState(false);


    const getTextColor = () => {
        if (disabled) {
            return { color: Theme.text.disabled };
        }
        return {
            color: Theme.text.primary,
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

const styles = StyleSheet.create({
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
        backgroundColor: Theme.button.tertiary.default,
        color: Theme.text.inverted
    },
    loading: {
        backgroundColor: Theme.button.tertiary.loading,
        color: Theme.text.inverted
    },
    pressed: {
        backgroundColor: Theme.button.tertiary.pressed,
        color: Theme.text.inverted
    },
    disabled: {
        backgroundColor: Theme.button.tertiary.disabled,
        color: Theme.text.disabled
    },

});

export default ActionButton;