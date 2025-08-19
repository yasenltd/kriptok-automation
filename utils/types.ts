import { ColorValue } from 'react-native';

export type ButtonState = 'default' | 'pressed' | 'disabled' | 'loading';
export type SelectableButtonState = 'default' | 'disabled' | 'loading';
export type ButtonStyle = 'accent' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
export type ButtonSize =
  | 'XS'
  | 'M'
  | 'L'
  | 'XL'
  | { width: number; height: number; fontSize?: number; iconSize?: number }
  | 'screen';
export type IconButtonSize = 'XS' | 'S' | 'M' | 'L';
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
