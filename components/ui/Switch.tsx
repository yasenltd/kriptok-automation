// import { Switch as ReactNativeSwitch } from "react-native";
import { Switch as ReactNativeSwitch } from "react-native-paper";
import { Theme } from "../../theme/theme";

interface SwitchProps {
    onValueChange: (value: boolean) => void;
    value: boolean;
    disabled?: boolean;
    size: 'L' | 'S';
}

const Switch: React.FC<SwitchProps> = ({
    onValueChange,
    value,
    disabled = false,
    size
}) => {

    function getSizeStyles() {
        // react native paper switch is 50x28 by default
        switch (size) {
            case "L":
                return { transform: [{ scaleX: 48 / 50 }, { scaleY: 1 }] };
            case "S":
                return { transform: [{ scaleX: 32 / 50 }, { scaleY: 20 / 28 }] };
        }
    }

    function getTrackColor() {
        if (disabled) {
            return {
                false: Theme.switch.off.inactive,
                true: Theme.switch.on.inactive
            }
        }
        return {
            false: Theme.switch.off.default,
            true: Theme.switch.on.default
        }
    }

    function getThumbColor() {
        if (disabled) {
            return value ? Theme.switch.on.circleInactive : Theme.switch.off.circleInactive;
        }
        return value ? Theme.switch.on.circleActive : Theme.switch.off.circleActive;
    }

    return (
        <ReactNativeSwitch
            onValueChange={onValueChange}
            value={value}
            disabled={disabled}
            trackColor={getTrackColor()}
            thumbColor={getThumbColor()}
            ios_backgroundColor={disabled ? Theme.switch.off.inactive : Theme.switch.off.default}
            style={[getSizeStyles()]}
        />
    );
};

export default Switch;