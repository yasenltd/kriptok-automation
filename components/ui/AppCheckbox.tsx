import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Theme } from '../../theme/theme';
import { typography } from '../../theme/typography';

type CheckboxProps = {
  value: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  color?: string;
};
const Checkbox: React.FC<CheckboxProps> = ({ value, onChange, label: text, description, color }) => {
  return (
    <Pressable style={{ maxWidth: '100%' }} onPress={() => onChange(!value)}>
      <View style={styles.container}>
        <View style={styles.labelContainer}>
          <MaterialIcons
            name={value ? 'check-box' : 'check-box-outline-blank'}
            size={20}
            color={color ?? value ? styles.checked.color : styles.unchecked.color}
            style={{ marginBottom: 2 }}
          />

          {text && (
            <Text
              style={styles.label}
            >
              {text}
            </Text>
          )}
        </View>
        {description && (<View style={styles.descriptionContainer}>

          <Text
            style={styles.description}
          >
            {description}
          </Text>
        </View>
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 4,
  },
  labelContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  descriptionContainer: {
    flexDirection: 'row',
    paddingLeft: 28, // indent description to align with checkbox
  },
  checked: {
    color: Theme.text.primary,
  },
  unchecked: {
    color: Theme.text.tertiary,
  },
  label: {
    color: Theme.text.primary,
    ...typography.checkbox.label,
  },
  description: {
    color: Theme.text.tertiary,
    ...typography.checkbox.description,
  }
});

export default Checkbox;
