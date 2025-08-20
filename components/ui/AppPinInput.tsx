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
  revertedTheme?: boolean;
};

const toFixedArray = (s: string, length: number) =>
  (s + ' '.repeat(length)).slice(0, length).split('');
const isDigit = (c: string) => /\d/.test(c);
const findNextEmpty = (arr: string[], startIdx: number) => {
  for (let i = startIdx + 1; i < arr.length; i++) if (!isDigit(arr[i])) return i;
  return -1;
};

const PinInput: React.FC<PinInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  autoFocus = true,
  cellSize = 42,
  isWrong,
  revertedTheme,
}) => {
  const { theme } = useTheme();

  const refs = useRef<Array<RNTextInput | null>>([]);

  const digits = useMemo(() => {
    const arr = toFixedArray(value, length);
    return arr.map(c => (isDigit(c) ? c : ''));
  }, [value, length]);

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

    const arr = toFixedArray(value, length);

    if (incoming.length === 1) {
      arr[index] = incoming;
      onChange(arr.join(''));

      const nextEmpty = findNextEmpty(arr, index);
      if (nextEmpty !== -1) {
        focusIndex(nextEmpty);
      } else {
        refs.current[length - 1]?.blur();
        const compact = arr.join('').replace(/ /g, '');
        if (onComplete && compact.length === length) onComplete(compact);
      }
      return;
    }

    let i = index;
    for (const c of incoming) {
      if (i >= length) break;
      arr[i] = c;
      i++;
    }
    onChange(arr.join(''));

    const nextEmpty = findNextEmpty(arr, index - 1 + incoming.length);
    if (nextEmpty !== -1) {
      focusIndex(nextEmpty);
    } else {
      refs.current[length - 1]?.blur();
      const compact = arr.join('').replace(/ /g, '');
      if (onComplete && compact.length === length) onComplete(compact);
    }
  };

  const clearAt = useCallback(
    (index: number) => {
      const arr = toFixedArray(value, length);
      arr[index] = ' ';
      onChange(arr.join(''));
    },
    [value, length, onChange],
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
              borderColor: revertedTheme ? theme.text.secondary : theme.text.primary,
              color: revertedTheme ? theme.text.secondary : theme.text.primary,
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
          selectionColor={revertedTheme ? theme.text.secondary : theme.text.primary}
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
