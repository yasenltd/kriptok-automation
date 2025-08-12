import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { default as React, useState } from 'react';
import { ColorValue, Pressable, Text, View } from 'react-native';
import { buttonStyles } from '../../hooks/useButtonStyles';
import { colors } from '../../theme/colors';
import { Theme } from '../../theme/DarkTheme';
import { typography } from '../../theme/typography';
import LoaderIcon from '../icons/LoaderIcon';

interface ButtonProps {
    label: string;
    disabled?: boolean;
    loading?: boolean;
    style?: "accent" | "secondary" | "tertiary" | "outline" | "ghost";
    size?: "XS" | "M" | "L" | "XL" | { width: number, height: number, fontSize?: number, iconSize?: number };
    onPress?: () => void;
    icon?: React.JSX.Element | { size: number, style: 'micro' | 'mini' | 'outline' | 'solid' };
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    label,
    disabled = false,
    loading = false,
    style = "accent",
    size = 'M',
    onPress,
    icon,
    showLeftIcon,
    showRightIcon
}) => {
    const [isPressed, setIsPressed] = useState(false);

    const getSizeStyles = () => {
        if (typeof size === 'object') {
            return {
                width: size.width,
                height: size.height,
                paddingHorizontal: 8,
                paddingVertical: 4,
            };
        }
        switch (size) {
            case "XS":
                return { width: 99, height: 20, paddingHorizontal: 8, paddingVertical: 4 }
            case "M":
                return { width: 140, height: 40, paddingHorizontal: 8, paddingVertical: 4 };
            case "L":
                return { width: 160, height: 44, paddingHorizontal: 8, paddingVertical: 8 };
            case "XL":
                return { width: 184, height: 52, paddingHorizontal: 8, paddingVertical: 12 };
        };
    };

    const getTextStyles = () => {
        switch (size) {
            case "XS":
            case "M":
            case "L":
                return typography.button.xsToL;
            case "XL":
                return typography.button.xl;
            default:
                return typography.button.xsToL;
        }
    };

    const getIconSize = () => {
        if (typeof size === 'object' && size.iconSize) {
            return size.iconSize;
        }
        return getTextStyles().fontSize;
    }

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

    const getButtonContent = () => {
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
                        {/* <ActivityIndicator
                            animating={loading}
                            color={getTextColor().color}
                            size={getTextStyles().fontSize}
                        /> */}
                        {showLeftIcon && loading && (
                            <LoaderIcon
                                size={getIconSize()}
                                color={getTextColor().color}
                            />
                        )}
                        {showLeftIcon && !loading && React.isValidElement(icon) &&
                            React.cloneElement(icon as React.ReactElement<any>, {
                                size: getIconSize(),
                                color: getTextColor().color
                            })
                        }
                        <Text style={[
                            getTextStyles(),
                            getTextColor(),
                        ]}>
                            {label}
                        </Text>
                        {showRightIcon && loading && (
                            <LoaderIcon
                                size={getIconSize()}
                                color={getTextColor().color}
                            />
                        )}
                        {showRightIcon && !loading && React.isValidElement(icon) &&
                            React.cloneElement(icon as React.ReactElement<any>, {
                                size: getIconSize(),
                                color: getTextColor().color
                            })
                        }
                    </View>
                </LinearGradient>
            );
        }

        // this is the best way to handle the blur effect
        // without needing huge third party libraries
        const needsBlur = ((style === "outline" || style === "ghost") && (loading || isPressed)) || (style === "tertiary" && !loading && !disabled && !isPressed);
        if (needsBlur) {
            return (
                <BlurView intensity={20} style={[buttonStyles.button, getSizeStyles(), getNonAccentStyles(), buttonStyles.blurContainer]}>
                    <View style={buttonStyles.content}>
                        {showLeftIcon && loading && (
                            <LoaderIcon
                                size={getIconSize()}
                                color={getTextColor().color}
                            />
                        )}
                        {showLeftIcon && !loading && React.isValidElement(icon) &&
                            React.cloneElement(icon as React.ReactElement<any>, {
                                size: getIconSize(),
                                color: getTextColor().color
                            })
                        }
                        <Text style={[
                            getTextStyles(),
                            getTextColor(),
                        ]}>
                            {label}
                        </Text>
                        {showRightIcon && loading && (
                            <LoaderIcon
                                size={getIconSize()}
                                color={getTextColor().color}
                            />
                        )}
                        {showRightIcon && !loading && React.isValidElement(icon) &&
                            React.cloneElement(icon as React.ReactElement<any>, {
                                size: getIconSize(),
                                color: getTextColor().color
                            })
                        }
                    </View>
                </BlurView>
            );
        }

        // Non-accent button styles
        return (
            <View style={[buttonStyles.button, getSizeStyles(), getNonAccentStyles()]}>
                <View style={buttonStyles.content}>
                    {showLeftIcon && loading && (
                        <LoaderIcon
                            size={getIconSize()}
                            color={getTextColor().color}
                        />
                    )}
                    {showLeftIcon && !loading && React.isValidElement(icon) &&
                        React.cloneElement(icon as React.ReactElement<any>, {
                            size: getIconSize(),
                            color: getTextColor().color
                        })
                    }
                    <Text style={[
                        getTextStyles(),
                        getTextColor(),
                    ]}>
                        {label}
                    </Text>
                    {showRightIcon && loading && (
                        <LoaderIcon
                            size={getIconSize()}
                            color={getTextColor().color}
                        />
                    )}
                    {showRightIcon && !loading && React.isValidElement(icon) &&
                        React.cloneElement(icon as React.ReactElement<any>, {
                            size: getIconSize(),
                            color: getTextColor().color
                        })
                    }
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

    const getButtonStyle = () => {
        return [buttonStyles.button];
    };

    return (
        <Pressable
            onPress={onPress}
            disabled={disabled || loading}
            style={getButtonStyle()}
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => setIsPressed(false)}
        >
            {getButtonContent()}
        </Pressable>
    );
};

export default Button;