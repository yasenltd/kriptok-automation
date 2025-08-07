import { Text, View, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/utils';

type CheckboxProps = {
  value: boolean;
  onChange: (checked: boolean) => void;
  text?: string;
  color?: string;
  testID?: string;
};

const AppCheckbox: React.FC<CheckboxProps> = ({ value, onChange, text, color, testID }) => {
  return (
    <Pressable
      style={{ maxWidth: '100%' }}
      onPress={() => onChange(!value)}
      testID={testID}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <MaterialIcons
          name={value ? 'check-box' : 'check-box-outline-blank'}
          size={20}
          color={color ?? colors['secondary-black']}
          style={{ marginBottom: 2 }}
        />
        {text && (
          <Text
            style={{
              marginLeft: 8,
              color: colors['text-black'],
              fontFamily: 'montserrat-regular',
              flexShrink: 1,
              fontSize: 12,
              lineHeight: 20,
            }}
          >
            {text}
          </Text>
        )}
      </View>
    </Pressable>
  );
};

export default AppCheckbox;
