import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { IconProps } from '../../utils/types';

const LoaderIcon: React.FC<IconProps> = ({ color, size = 16, iconStyle = 'micro', style }) => {
  const { theme } = useTheme();
  const spinValue = useRef(new Animated.Value(0)).current;
  color = color ?? theme.icons.primary;

  useEffect(() => {
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    spinAnimation.start();

    return () => spinAnimation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const microSpinnerSvg = `
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                fill-rule="evenodd" 
                clip-rule="evenodd" 
                d="M8.75 1.74976C8.75 2.16397 8.41421 2.49976 8 2.49976C4.96243 2.49976 2.5 4.96219 2.5 7.99976C2.5 11.0373 4.96243 13.4998 8 13.4998C11.0376 13.4998 13.5 11.0373 13.5 7.99976C13.5 7.58554 13.8358 7.24976 14.25 7.24976C14.6642 7.24976 15 7.58554 15 7.99976C15 11.8657 11.866 14.9998 8 14.9998C4.13401 14.9998 1 11.8657 1 7.99976C0.999999 4.13376 4.13401 0.999756 8 0.999756C8.41421 0.999756 8.75 1.33554 8.75 1.74976Z" 
                fill="${color.toString()}"
            />
        </svg>
    `;

  const miniSpinnerSvg = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                fill-rule="evenodd" 
                clip-rule="evenodd" 
                d="M10.75 2.74976C10.75 3.16397 10.4142 3.49976 10 3.49976C6.41015 3.49976 3.5 6.4099 3.5 9.99976C3.5 13.5896 6.41015 16.4998 10 16.4998C13.5899 16.4998 16.5 13.5896 16.5 9.99976C16.5 9.58554 16.8358 9.24976 17.25 9.24976C17.6642 9.24976 18 9.58554 18 9.99976C18 14.418 14.4183 17.9998 10 17.9998C5.58172 17.9998 2 14.418 2 9.99975C2 5.58148 5.58172 1.99976 10 1.99976C10.4142 1.99976 10.75 2.33554 10.75 2.74976Z" 
                fill="${color.toString()}"
            />
        </svg>
    `;

  const outlineSpinnerSvg = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                d="M12 2.99976C7.02944 2.99976 3 7.02919 3 11.9998C3 16.9703 7.02944 20.9998 12 20.9998C16.9706 20.9998 21 16.9703 21 11.9998" 
                stroke="${color.toString()}" 
                stroke-width="1.5" 
                stroke-linecap="round" 
                stroke-linejoin="round"
            />
        </svg>
    `;

  const solidSpinnerSvg = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
                fill-rule="evenodd" 
                clip-rule="evenodd" 
                d="M12.5 2.74976C12.5 3.16397 12.1642 3.49976 11.75 3.49976C7.19365 3.49976 3.5 7.19341 3.5 11.7498C3.5 16.3061 7.19365 19.9998 11.75 19.9998C16.3063 19.9998 20 16.3061 20 11.7498C20 11.3355 20.3358 10.9998 20.75 10.9998C21.1642 10.9998 21.5 11.3355 21.5 11.7498C21.5 17.1345 17.1348 21.4998 11.75 21.4998C6.36522 21.4998 2 17.1345 2 11.7498C2 6.36498 6.36522 1.99976 11.75 1.99976C12.1642 1.99976 12.5 2.33554 12.5 2.74976Z" 
                fill="${color.toString()}"
            />
        </svg>
    `;

  const spinnerSvg =
    iconStyle === 'micro'
      ? microSpinnerSvg
      : iconStyle === 'mini'
        ? miniSpinnerSvg
        : iconStyle === 'outline'
          ? outlineSpinnerSvg
          : solidSpinnerSvg;

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ rotate: spin }],
        },
      ]}
    >
      <SvgXml xml={spinnerSvg} width={size} height={size} />
    </Animated.View>
  );
};

export default LoaderIcon;
