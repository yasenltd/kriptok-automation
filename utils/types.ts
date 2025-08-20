import { BlurViewProps } from 'expo-blur';
import { LinearGradientProps } from 'expo-linear-gradient';
import { ReactElement } from 'react';
import { ColorValue, ViewProps } from 'react-native';

export type ButtonVariant = 'accent' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
export type ButtonState = 'default' | 'pressed' | 'loading' | 'disabled';
export type CustomSize = { width: number; height: number; fontSize?: number; iconSize?: number };
export type ButtonSize = 'XS' | 'M' | 'L' | 'XL' | 'screen' | CustomSize;
export type IconButtonSize = 'XS' | 'S' | 'M' | 'L';

export type GradientWrapper = {
  kind: 'gradient';
  props: Omit<LinearGradientProps, 'children'>;
};
export type BlurWrapper = {
  kind: 'blur';
  props: Omit<BlurViewProps, 'children'>;
};
export type ViewWrapper = {
  kind: 'view';
  props: ViewProps;
};

export type Wrapper = GradientWrapper | BlurWrapper | ViewWrapper;

export type LinkVariant = 'accent' | 'secondary' | 'destruct' | 'create';
export type LinkSize = 'S' | 'L';

export type Icon = React.JSX.Element | IconProps;
export interface IconProps {
  color?: ColorValue;
  size?: number;
  iconStyle?: 'micro' | 'mini' | 'outline' | 'solid';
  style?: any;
}
export type InputStyle = 'fill' | 'stroke';
export type InputSize = 'normal' | 'big';
export type InputWidth = 'small' | 'medium' | 'large' | 'screen' | { width: number };
export type InputState = 'default' | 'focused' | 'disabled' | 'error';

export interface TokenItem {
  label: string;
  value: string;
  icon: () => ReactElement<IconProps>;
}
