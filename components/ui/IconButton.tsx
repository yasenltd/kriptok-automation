import { useButtonStyles } from '@/hooks/useButtonStyles';
import { ButtonState, ButtonStyle, Icon, IconButtonSize, SelectableButtonState } from '@/utils/types';
import BlurView from 'expo-blur/build/BlurView';
import { LinearGradient } from 'expo-linear-gradient';
import { default as React, useState } from 'react';
import { Pressable, View } from 'react-native';


interface IconButtonProps {
    state?: SelectableButtonState;
    style?: ButtonStyle;
    size?: IconButtonSize
    onPress?: () => void;
    icon: Icon;
}

const IconButton: React.FC<IconButtonProps> = ({
    state = 'default',
    style = "accent",
    size = 'M',
    onPress,
    icon
}) => {
    const { buttonStyles, getAccentGradientColors, getButtonTextColor, getStyles } = useButtonStyles();
    const [currentState, setCurrentState] = useState<ButtonState>(state);

    const getSizeStyles = () => {
        return sizeStyles[size];
    };

    const getTextColor = () => {
        return getButtonTextColor(currentState, style);
    };

    const getIconButtonStyles = () => {
        return getStyles(currentState, style);
    };

    const getIconButtonContent = () => {
        if (style === "accent") {
            let gradientColors = getAccentGradientColors(currentState);

            return (
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[buttonStyles.gradient, getSizeStyles()]}
                >
                    <View style={buttonStyles.content}>
                        {React.cloneElement(icon as React.ReactElement<any>, {
                            size: sizeStyles[size].icon.size,
                            style: sizeStyles[size].icon.style,
                            color: getTextColor()
                        })}
                    </View>
                </LinearGradient>
            );
        }

        // this is the best way to handle the blur effect
        // without needing huge third party libraries
        const needsBlur = (style === "outline" || style === "ghost") && (currentState == 'loading' || currentState == 'pressed');
        if (needsBlur) {
            return (
                <BlurView intensity={20} style={[buttonStyles.button, getSizeStyles(), getIconButtonStyles(), buttonStyles.blurContainer]}>
                    <View style={buttonStyles.content}>
                        {React.cloneElement(icon as React.ReactElement<any>, {
                            size: sizeStyles[size].icon.size,
                            style: sizeStyles[size].icon.style,
                            color: getTextColor()
                        })}
                    </View>
                </BlurView>)
        }

        // Non-accent button styles
        return (
            <View style={[buttonStyles.button, getSizeStyles(), getIconButtonStyles()]}>
                <View style={buttonStyles.content}>
                    {React.cloneElement(icon as React.ReactElement<any>, {
                        size: sizeStyles[size].icon.size,
                        style: sizeStyles[size].icon.style,
                        color: getTextColor()
                    })}
                </View>
            </View>
        );
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={currentState === 'disabled' || currentState === 'loading'}
            style={buttonStyles.button}
            onPressIn={() => setCurrentState('pressed')}
            onPressOut={() => setCurrentState('default')}
        >
            {getIconButtonContent()}
        </Pressable>
    );
};

const sizeStyles = {
    XS: {
        width: 16,
        height: 16,
        paddingHorizontal: 8,
        paddingVertical: 4,
        icon: {
            size: 16,
            style: 'micro',
        }
    },
    S: {
        width: 32,
        height: 32,
        paddingHorizontal: 8,
        paddingVertical: 4,
        icon: {
            size: 16,
            style: 'micro',
        }
    },
    M: {
        width: 40,
        height: 40,
        paddingHorizontal: 8,
        paddingVertical: 4,
        icon: {
            size: 20,
            style: 'outline',
        }
    },
    L: {
        width: 48,
        height: 48,
        paddingHorizontal: 8,
        paddingVertical: 8,
        icon: {
            size: 24,
            style: 'outline',
        }
    },
};

export default IconButton;