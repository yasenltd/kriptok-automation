import 'react-native-get-random-values';
import { Buffer } from 'buffer';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if (typeof (global as any).Buffer === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (global as any).Buffer = Buffer;
}

if (!global.crypto) {
  global.crypto = {} as Crypto;
}
