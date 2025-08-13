import { useEffect, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Button from './Button';

type ToggleKey = number | string;
interface ToggleOption {
  key: ToggleKey;
  label: string;
  icon?: React.JSX.Element | { size: number; style: 'micro' | 'mini' | 'outline' | 'solid' };
}
interface ToggleProps {
  layout?: 'horizontal' | 'vertical';
  options: [ToggleOption, ...ToggleOption[]];
  style?: StyleProp<ViewStyle>;
}

const Toggle: React.FC<ToggleProps> = ({ layout = 'horizontal', options, style }) => {
  const [selectedKey, setSelectedKey] = useState<ToggleKey>(options[0].key);

  useEffect(() => {
    setSelectedKey(options[0].key);
  }, [options]);

  return (
    <View style={[styles[layout], styles.common, style]}>
      {options.map(option => (
        <Button
          key={option.key}
          label={option.label}
          onPress={() => setSelectedKey(option.key)}
          style={selectedKey === option.key ? 'secondary' : 'ghost'}
          size={{ width: 71, height: 28, fontSize: 14, iconSize: 16 }}
          icon={option.icon}
          showLeftIcon={!!option.icon}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  common: {
    borderRadius: 9999,
    padding: 2,
  },
  horizontal: {
    flexDirection: 'row',
    gap: 4,
  },
  vertical: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
});

export default Toggle;
