import { StyleSheet } from 'react-native';
import { typography } from '../../theme/typography';

export const commonStyles = StyleSheet.create({
  container: { flexDirection: 'column', gap: 6 },
  label: {
    ...typography.input.label,
  },
  hint: {
    ...typography.input.hint,
  },
  disabledHint: {
    ...typography.input.hint,
  },
  error: {
    ...typography.input.hint,
  },
  textInput: {
    flexGrow: 1,
    flexShrink: 0,
    ...typography.input.placeholder,
  },
  inputWrapper: {
    borderWidth: 1,
  },
});
