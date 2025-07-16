import 'react-native-get-random-values';
import { Buffer } from 'buffer';

if (typeof global.Buffer === 'undefined') {
  global.Buffer = Buffer;
}

import { Slot } from 'expo-router';

export default function App() {
  return <Slot />;
}
