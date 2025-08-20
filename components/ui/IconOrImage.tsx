import React, { ReactElement } from 'react';
import { ColorValue, Image } from 'react-native';
import { Icon } from '../../utils/types';

interface IconOrImage {
  icon: Icon | string | number;
  size: number;
  color?: ColorValue;
}

const IconOrImage = ({ icon, size, color }: IconOrImage) => {
  if (typeof icon === 'string') {
    return <Image source={{ uri: icon }} style={{ width: size, height: size }} />;
  }

  if (typeof icon === 'number') {
    return <Image source={icon} style={{ width: size, height: size }} />;
  }

  if (React.isValidElement(icon)) {
    return React.cloneElement(icon as ReactElement<Icon>, { size, color });
  }

  return null;
};

export default IconOrImage;
