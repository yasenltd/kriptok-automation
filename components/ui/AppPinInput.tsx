import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/theme/colors';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { TextInput, View, StyleSheet, TextInput as RNTextInput, Platform } from 'react-native';

type PinInputProps = {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  onComplete?: (val: string) => void;
  autoFocus?: boolean;
  cellSize?: number;
  isWrong?: boolean;
};

const PinInput: React.FC<PinInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  autoFocus = true,
  cellSize = 42,
  isWrong,
}) => {
  const { theme } = useTheme();

  const refs = useRef<Array<RNTextInput | null>>([]);

  const digits = useMemo(() => Array.from({ length }, (_, i) => value[i] ?? ''), [value, length]);

  const setRef =
    (index: number): React.RefCallback<RNTextInput> =>
    r => {
      refs.current[index] = r;
    };

  const focusIndex = useCallback(
    (i: number) => {
      const ref = refs.current[i];
      if (ref) ref.focus();
    },
    [refs.current],
  );

  const setCharAt = (index: number, char: string, sourceText?: string) => {
    const incoming = (sourceText ?? char).replace(/\D/g, '');
    if (!incoming) return;

    let newVal = value.split('');
    let i = index;
    for (const c of incoming) {
      if (i >= length) break;
      newVal[i] = c;
      i++;
    }
    const joined = newVal.join('').slice(0, length);
    onChange(joined);

    if (i <= length - 1) {
      focusIndex(i);
    } else {
      refs.current[length - 1]?.blur();
      if (onComplete && joined.length === length) onComplete(joined);
    }
  };

  const clearAt = useCallback(
    (index: number) => {
      const arr = value.split('');
      arr[index] = '';
      onChange(arr.join(''));
    },
    [value],
  );

  useEffect(() => {
    if (autoFocus && refs.current[0]) {
      refs.current[0].focus();
    }
  }, [autoFocus]);

  return (
    <View
      style={[
        styles.row,
        isWrong && styles.wrong,
        { borderColor: isWrong ? colors.error[40] : undefined },
      ]}
    >
      {digits.map((digit, i) => (
        <TextInput
          key={i}
          ref={setRef(i)}
          testID={`pin-cell-${i}`}
          style={[
            styles.cell,
            {
              width: cellSize,
              height: cellSize,
              borderRadius: 2,
              borderColor: theme.text.primary,
              color: theme.text.primary,
            },
            digit ? styles.cellFilled : null,
          ]}
          value={digit ? '*' : ''}
          onChangeText={txt => setCharAt(i, txt.slice(-1), txt)}
          onKeyPress={({ nativeEvent }) => {
            if (nativeEvent.key === 'Backspace') {
              if (digits[i]) {
                clearAt(i);
              } else if (i > 0) {
                const prev = i - 1;
                focusIndex(prev);
                const arr = value.split('');
                arr[prev] = '';
                onChange(arr.join(''));
              }
            }
          }}
          keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
          textContentType="oneTimeCode"
          secureTextEntry={true}
          maxLength={1}
          autoCorrect={false}
          autoCapitalize="none"
          selection={{ start: 1, end: 1 }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  cell: {
    borderWidth: 1,
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 24,
  },
  cellFilled: {
    borderColor: '#9CA3AF',
  },
  wrong: {
    borderWidth: 2,
    padding: 2,
    borderRadius: 6,
  },
});

export default PinInput;
