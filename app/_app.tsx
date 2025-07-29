import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import '../utils/i18n';

if (typeof (global as any).Buffer === 'undefined') {
  (global as any).Buffer = Buffer;
}

import { Slot } from 'expo-router';

export default function App() {
  return <Slot />;
}
