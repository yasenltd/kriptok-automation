import { MaterialIcons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';

type CheckboxProps = {
  value: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
  color?: string;
};
const Checkbox: React.FC<CheckboxProps> = ({ value, onChange, label: text, description, color }) => {
  const styles = useCheckboxStyles();

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

const useCheckboxStyles = () => {
  const { theme } = useTheme();
  return useMemo(() => StyleSheet.create({
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
      color: theme.text.primary,
    },
    unchecked: {
      color: theme.text.tertiary,
    },
    label: {
      color: theme.text.primary,
      ...typography.checkbox.label,
    },
    description: {
      color: theme.text.tertiary,
      ...typography.checkbox.description,
    }
  }), [theme]);
};

export default Checkbox;
