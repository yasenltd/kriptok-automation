import { useButtonStyles } from '@/hooks/useButtonStyles';
import { typography } from '@/theme/typography';
import { ButtonSize, ButtonState, ButtonStyle, Icon, SelectableButtonState } from '@/utils/types';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { default as React, useState } from 'react';
import { ColorValue, Pressable, Text, TextStyle, View } from 'react-native';
import LoaderIcon from '../icons/LoaderIcon';

interface ButtonProps {
    label: string;
    state?: SelectableButtonState;
    style?: ButtonStyle
    size?: ButtonSize | { width: number, height: number, fontSize?: number, iconSize?: number };
    onPress?: () => void;
    icon?: Icon;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    label = "",
    state = 'default',
    style = "accent",
    size = 'M',
    onPress,
    icon,
    showLeftIcon,
    showRightIcon
}) => {
    const { buttonStyles, getAccentGradientColors, getButtonTextColor, getStyles } = useButtonStyles();
    const [currentState, setCurrentState] = useState<ButtonState>(state);

    const getSizeStyles = () => {
        if (typeof size === 'object') {
            return {
                width: size.width,
                height: size.height,
                paddingHorizontal: 8,
                paddingVertical: 4,
            };
        }
        return sizeStyles[size];
    };

    const getTextColor = () => {
        return getButtonTextColor(currentState, style);
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

    const getButtonStyles = () => {
        return getStyles(currentState, style);
    }

    const getButtonContent = () => {
        if (style === "accent") {
            let gradientColors = getAccentGradientColors(currentState);

            return (
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[buttonStyles.gradient, getSizeStyles(), getButtonStyles()]}
                >
                    <ButtonContents
                        state={currentState}
                        icon={icon}
                        iconSize={getIconSize()}
                        textStyles={getTextStyles()}
                        textColor={getTextColor()}
                        label={label}
                        showLeftIcon={showLeftIcon}
                        showRightIcon={showRightIcon}
                    />
                </LinearGradient>
            );
        }

        const isDefault = (currentState === 'default');
        const loading = (currentState === 'loading');
        const pressed = (currentState === 'pressed');
        const disabled = (currentState === 'disabled');
        const needsBlur =
            ((style === "outline" || style === "ghost") && (loading || pressed)) ||
            (style === "tertiary" && isDefault);
        if (needsBlur) {
            return (
                <BlurView intensity={20} style={[getSizeStyles(), buttonStyles.blurContainer]}>
                    <ButtonContents
                        state={currentState}
                        icon={icon}
                        iconSize={getIconSize()}
                        textStyles={getTextStyles()}
                        textColor={getTextColor()}
                        label={label}
                        showLeftIcon={showLeftIcon}
                        showRightIcon={showRightIcon}
                    />
                </BlurView>
            );
        }

        return (
            <View style={[buttonStyles.button, getSizeStyles(), getStyles(currentState, style)]}>
                <ButtonContents
                    state={currentState}
                    icon={icon}
                    iconSize={getIconSize()}
                    textStyles={getTextStyles()}
                    textColor={getTextColor()}
                    label={label}
                    showLeftIcon={showLeftIcon}
                    showRightIcon={showRightIcon}
                />
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
            {getButtonContent()}
        </Pressable>
    );
};

interface ButtonContentsProps {
    state: ButtonState;
    icon?: Icon;
    iconSize: number;
    textStyles: TextStyle;
    textColor: ColorValue;
    label: string;
    showLeftIcon?: boolean;
    showRightIcon?: boolean;
};


const ButtonContents: React.FC<ButtonContentsProps> = ({ state, icon, iconSize, textStyles, textColor, label, showLeftIcon, showRightIcon }) => {
    const { buttonStyles } = useButtonStyles();

    const loading = (state === 'loading');
    return (
        <View style={buttonStyles.content}>
            {showLeftIcon && loading && <LoaderIcon size={iconSize} color={textColor} />}
            {showLeftIcon && !loading && icon && React.isValidElement(icon) && React.cloneElement((icon as React.ReactElement<any>), {
                size: iconSize,
                color: textColor
            })}
            <Text style={[textStyles, { color: textColor }]}>
                {label}
            </Text>
            {showRightIcon && loading && <LoaderIcon size={iconSize} color={textColor} />}
            {showRightIcon && !loading && icon && React.isValidElement(icon) && React.cloneElement((icon as React.ReactElement<any>), {
                size: iconSize,
                color: textColor
            })}
        </View>
    );
}

const sizeStyles = {
    XS: { width: 99, height: 20, paddingHorizontal: 8, paddingVertical: 4 },
    S: { width: 120, height: 32, paddingHorizontal: 8, paddingVertical: 4 },
    M: { width: 140, height: 40, paddingHorizontal: 8, paddingVertical: 4 },
    L: { width: 160, height: 44, paddingHorizontal: 8, paddingVertical: 8 },
    XL: { width: 184, height: 52, paddingHorizontal: 8, paddingVertical: 12 }
};

export default Button;

