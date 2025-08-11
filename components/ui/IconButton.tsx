import BlurView from 'expo-blur/build/BlurView';
import { LinearGradient } from 'expo-linear-gradient';
import { default as React, useState } from 'react';
import { ColorValue, Pressable, View } from 'react-native';
import { buttonStyles } from '../../theme/buttonStyle';
import { colors } from '../../theme/colors';
import { Theme } from '../../theme/theme';
import { typography } from '../../theme/typography';

interface IconButtonProps {
    disabled?: boolean;
    loading?: boolean;
    style?: "accent" | "secondary" | "tertiary" | "outline" | "ghost";
    size?: "XS" | "S" | "M" | "L";
    onPress?: () => void;
    icon?: React.JSX.Element | { size: number, style: 'micro' | 'mini' | 'outline' | 'solid' };
}

const IconButton: React.FC<IconButtonProps> = ({
    disabled = false,
    loading = false,
    style = "accent",
    size = 'M',
    onPress,
    icon
}) => {
    const [isPressed, setIsPressed] = useState(false);

    const getSizeStyles = () => {
        switch (size) {
            case "XS":
                return { width: 16, height: 16, paddingHorizontal: 8, paddingVertical: 4 };
            case "S":
                return { width: 32, height: 32, paddingHorizontal: 8, paddingVertical: 4 };
            case "M":
                return { width: 40, height: 40, paddingHorizontal: 8, paddingVertical: 4 };
            case "L":
                return { width: 48, height: 48, paddingHorizontal: 8, paddingVertical: 8 };
        }
    };

    const getTextStyles = () => {
        switch (size) {
            case "XS":
            case "S":
            case "M":
            case "L":
                return typography.button.xsToL;
            default:
                return typography.button.xsToL;
        }
    };

    const getTextColor = () => {
        if (disabled) {
            return { color: Theme.text.disabled };
        }

        switch (style) {
            case "accent":
            case "secondary":
                return { color: Theme.text.inverted };
            case "tertiary":
            case "outline":
            case "ghost":
            default:
                return { color: Theme.text.primary };
        }
    };

    const getIconButtonContent = () => {
        if (style === "accent") {
            let gradientColors = [colors.blue[30], colors.blue[60]] as [ColorValue, ColorValue];

            if (disabled) {
                gradientColors = [Theme.button.secondary.disabled, Theme.button.secondary.disabled];
            } else if (loading) {
                gradientColors = [colors.blue[10], colors.blue[40]];
            } else if (isPressed) {
                gradientColors = [colors.blue[10], colors.blue[10]];
            }

            return (
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[buttonStyles.gradient, getSizeStyles(), getAccentBackground()]}
                >
                    <View style={buttonStyles.content}>
                        {React.cloneElement(icon as React.ReactElement<any>, {
                            size: iconStyles[size].size,
                            style: iconStyles[size].style,
                            color: getTextColor().color
                        })}
                    </View>
                </LinearGradient>
            );
        }

        // this is the best way to handle the blur effect
        // without needing huge third party libraries
        const needsBlur = (style === "outline" || style === "ghost") && (loading || isPressed);
        if (needsBlur) {
            return (
                <BlurView intensity={20} style={[buttonStyles.button, getSizeStyles(), getNonAccentStyles(), buttonStyles.blurContainer]}>
                    <View style={buttonStyles.content}>
                        {React.cloneElement(icon as React.ReactElement<any>, {
                            size: iconStyles[size].size,
                            style: iconStyles[size].style,
                            color: getTextColor().color
                        })}
                    </View>
                </BlurView>)
        }

        // Non-accent button styles
        return (
            <View style={[buttonStyles.button, getSizeStyles(), getNonAccentStyles()]}>
                <View style={buttonStyles.content}>
                    {React.cloneElement(icon as React.ReactElement<any>, {
                        size: iconStyles[size].size,
                        style: iconStyles[size].style,
                        color: getTextColor().color
                    })}
                </View>
            </View>
        );
    };

    const getAccentBackground = () => {
        if (style !== "accent") return {};

        if (disabled) {
            return buttonStyles.accentDisabled;
        } else if (loading) {
            return buttonStyles.accentLoading;
        } else if (isPressed) {
            return buttonStyles.accentPressed;
        } else {
            return buttonStyles.accentDefault;
        }
    };

    const getNonAccentStyles = () => {
        if (style === "secondary") {
            if (disabled) return buttonStyles.secondaryDisabled;
            if (loading) return buttonStyles.secondaryLoading;
            if (isPressed) return buttonStyles.secondaryPressed;
            return buttonStyles.secondaryDefault;
        }

        if (style === "tertiary") {
            if (disabled) return buttonStyles.tertiaryDisabled;
            if (loading) return buttonStyles.tertiaryLoading;
            if (isPressed) return buttonStyles.tertiaryPressed;
            return buttonStyles.tertiaryDefault;
        }

        if (style === "outline") {
            if (disabled) return buttonStyles.outlineDisabled;
            if (loading) return buttonStyles.outlineLoading;
            if (isPressed) return buttonStyles.outlinePressed;
            return buttonStyles.outlineDefault;
        }

        if (style === "ghost") {
            if (disabled) return buttonStyles.ghostDisabled;
            if (loading) return buttonStyles.ghostLoading;
            if (isPressed) return buttonStyles.ghostPressed;
            return buttonStyles.ghostDefault;
        }

        return {};
    };

    const getIconButtonStyle = () => {
        return [buttonStyles.button];
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={getIconButtonStyle()}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
        >
            {getIconButtonContent()}
        </Pressable>
    );
};

const iconStyles = {
    XS: {
        size: 16,
        style: 'micro',
    },
    S: {
        size: 16,
        style: 'micro',
    },
    M: {
        size: 20,
        style: 'outline',
    },
    L: {
        size: 24,
        style: 'outline',
    },
};

export default IconButton;