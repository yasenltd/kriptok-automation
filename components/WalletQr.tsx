import React from 'react';
import { View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

const WalletQr = ({ address, size = 200 }: { address: string; size?: number }) => {
  return (
    <View style={{ alignItems: 'center' }}>
      <QRCode value={address} size={size} backgroundColor="transparent" ecl="M" />
    </View>
  );
};

export default WalletQr;
