import { ColorValue } from 'react-native';

export type ButtonState = 'default' | 'pressed' | 'disabled' | 'loading';
export type SelectableButtonState = 'default' | 'disabled' | 'loading';
export type ButtonStyle = 'accent' | 'secondary' | 'tertiary' | 'outline' | 'ghost';
export type ButtonSize =
  | 'XS'
  | 'M'
  | 'L'
  | 'XL'
  | { width: number; height: number; fontSize?: number; iconSize?: number };
export type IconButtonSize = 'XS' | 'S' | 'M' | 'L';
export type Icon = React.JSX.Element | IconProps;

export interface IconProps {
  color?: ColorValue;
  size?: number;
  iconStyle?: 'micro' | 'mini' | 'outline' | 'solid';
  style?: any;
}
