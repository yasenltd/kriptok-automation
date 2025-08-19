import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import Safe from '@/assets/images/safe.svg';

type ConcentricCirclesProps = {
  size?: number;
  rings?: number;
  color?: string;
  baseBorder?: number;
  increment?: number;
  ringGap?: number;
  safeSize?: number;
};

const ConcentricCircles: React.FC<ConcentricCirclesProps> = ({
  size = 400,
  rings = 5,
  color = '#31353C',
  baseBorder = 1,
  increment = 0.2,
  ringGap = 20,
  safeSize = 80,
}) => {
  const data = useMemo(
    () =>
      Array.from({ length: rings }, (_, i) => {
        const borderWidth = baseBorder + i * increment;
        const ringSize = size - i * 2 * ringGap;
        return { borderWidth, ringSize };
      }),
    [size, rings, baseBorder, increment, ringGap],
  );

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {data.map(({ borderWidth, ringSize }, idx) => (
        <View
          key={idx}
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            borderWidth,
            borderColor: color,
          }}
        />
      ))}

      <View
        style={[
          StyleSheet.absoluteFillObject,
          { alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', zIndex: 10 },
        ]}
      >
        <Safe width={safeSize} height={safeSize} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ConcentricCircles;
