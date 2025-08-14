import { useTheme } from '@/context/ThemeContext';
import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const WalletQr = ({ address, size = 200 }: { address: string; size?: number }) => {
  const { colorScheme } = useTheme();
  return (
    <View style={{ alignItems: 'center' }}>
      <QRCode
        value={address}
        size={size}
        color={colorScheme === 'dark' ? '#FFFFFF' : '#000000'}
        backgroundColor="transparent"
        ecl="M"
      />
    </View>
  );
};

export default WalletQr;
