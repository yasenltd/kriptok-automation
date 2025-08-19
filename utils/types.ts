import { BlurViewProps } from 'expo-blur';
import { LinearGradientProps } from 'expo-linear-gradient';
import { ReactElement } from 'react';
import { ColorValue, ViewProps } from 'react-native';

export type ButtonVariant = 'accent' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
export type CustomSize = { width: number; height: number; fontSize?: number; iconSize?: number };
export type ButtonSize = 'XS' | 'M' | 'L' | 'XL' | CustomSize;
export type IconButtonSize = 'XS' | 'S' | 'M' | 'L';

type GradientWrapper = {
  kind: 'gradient';
  props: Omit<LinearGradientProps, 'children'>;
  component: React.ComponentType<LinearGradientProps>;
};
type BlurWrapper = {
  kind: 'blur';
  props: Omit<BlurViewProps, 'children'>;
  component: React.ComponentType<BlurViewProps>;
};
type ViewWrapper = {
  kind: 'view';
  props: ViewProps;
  component: React.ComponentType<ViewProps>;
};
export type Wrapper = GradientWrapper | BlurWrapper | ViewWrapper;

export type LinkVariant = 'accent' | 'secondary' | 'destruct' | 'create';
export type LinkSize = 'S' | 'L';
export type LinkState = 'default' | 'pressed' | 'disabled';

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
  icon: () => ReactElement;
}
