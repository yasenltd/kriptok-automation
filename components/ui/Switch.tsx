import { useTheme } from '@/context/ThemeContext';
import { Switch as ReactNativeSwitch } from 'react-native-paper';

interface SwitchProps {
  onValueChange: (value: boolean) => void;
  value: boolean;
  disabled?: boolean;
  size?: 'L' | 'S';
}

const Switch: React.FC<SwitchProps> = ({ onValueChange, value, disabled = false, size = 'L' }) => {
  const { theme } = useTheme();

  function getSizeStyles() {
    switch (size) {
      case 'L':
        return { transform: [{ scaleX: 48 / 50 }, { scaleY: 1 }] };
      case 'S':
        return { transform: [{ scaleX: 32 / 50 }, { scaleY: 20 / 28 }] };
    }
  }

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
      style={[getSizeStyles()]}
    />
  );
};

export default Switch;
