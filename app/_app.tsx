import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import '../utils/i18n';

if (typeof (global as any).Buffer === 'undefined') {
  (global as any).Buffer = Buffer;
}

if (!global.crypto) {
  global.crypto = {} as Crypto;
}

import { Slot } from 'expo-router';

export default function App() {
  return <Slot />;
}
