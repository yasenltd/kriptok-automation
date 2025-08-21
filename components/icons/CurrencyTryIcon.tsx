import React from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext';
import { IconProps } from '../../utils/types';

const CurrencyTryIcon: React.FC<IconProps> = ({ color, size = 16, iconStyle = 'micro', style }) => {
  const { theme } = useTheme();
  color = color ?? theme.icons.primary;

  const microTrySvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.75 4H7.25V6.97H5.5V8.22H7.25V13H8.75V8.22H10.5V6.97H8.75V4Z" fill=${color.toString()}/>
</svg>`;

  const miniTrySvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 3H7V6.5H4.5V8H7V13H9V8H11.5V6.5H9V3Z" fill=${color.toString()}/>
</svg>`;

  const outlineTrySvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 2H7V6H4V8H7V14H9V8H12V6H9V2Z" stroke=${color.toString()} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

  const solidTrySvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M9 2H7V6H4V8H7V14H9V8H12V6H9V2Z" fill=${color.toString()}/>
</svg>`;

  const renderIcon = () => {
    let svgXml;
    switch (iconStyle) {
      case 'micro':
        svgXml = microTrySvg;
        break;
      case 'mini':
        svgXml = miniTrySvg;
        break;
      case 'outline':
        svgXml = outlineTrySvg;
        break;
      case 'solid':
      default:
        svgXml = solidTrySvg;
        break;
    }

    return <SvgXml xml={svgXml} width={size} height={size} color={color} />;
  };

  return <View style={style}>{renderIcon()}</View>;
};

export default CurrencyTryIcon;
