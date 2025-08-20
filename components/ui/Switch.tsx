import { useTheme } from '@/context/ThemeContext';
import { Switch as ReactNativeSwitch } from 'react-native-paper';

interface SwitchProps {
  onValueChange: (value: boolean) => void;
  value: boolean;
  disabled?: boolean;
  size?: 'L' | 'S';
}

const sizeMapping: Record<'L' | 'S', object> = {
  L: { transform: [{ scaleX: 48 / 50 }, { scaleY: 1 }] },
  S: { transform: [{ scaleX: 32 / 50 }, { scaleY: 20 / 28 }] },
};

const Switch: React.FC<SwitchProps> = ({ onValueChange, value, disabled = false, size = 'L' }) => {
  const { theme } = useTheme();

  function getTrackColor() {
    if (disabled) {
      return {
        false: theme.switch.off.inactive,
        true: theme.switch.on.inactive,
      };
    }
    return {
      false: theme.switch.off.default,
      true: theme.switch.on.default,
    };
  }

  function getThumbColor() {
    if (disabled) {
      return value ? theme.switch.on.circleInactive : theme.switch.off.circleInactive;
    }
    return value ? theme.switch.on.circleActive : theme.switch.off.circleActive;
  }

  return (
    <ReactNativeSwitch
      onValueChange={onValueChange}
      value={value}
      disabled={disabled}
      trackColor={getTrackColor()}
      thumbColor={getThumbColor()}
      ios_backgroundColor={disabled ? theme.switch.off.inactive : theme.switch.off.default}
      style={[sizeMapping[size]]}
    />
  );
};

export default Switch;
