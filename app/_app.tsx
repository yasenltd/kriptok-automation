import 'react-native-get-random-values';
import { Buffer } from 'buffer';
import '../utils/i18n';
import { sha256 } from '@noble/hashes/sha2';

if (typeof (global as any).Buffer === 'undefined') {
  (global as any).Buffer = Buffer;
}

if (!global.crypto) {
  global.crypto = {} as Crypto;
}

global.crypto = {
  subtle: {
    digest: async (algorithm: string, data: BufferSource): Promise<ArrayBuffer> => {
      if (algorithm === 'SHA-256') {
        const input =
          data instanceof ArrayBuffer
            ? new Uint8Array(data)
            : new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
        const hash = sha256(input);
        return Uint8Array.from(hash).buffer;
      }
      throw new Error(`Unsupported algorithm: ${algorithm}`);
    },
  },
} as Crypto;

import { Slot } from 'expo-router';

export default function App() {
  return <Slot />;
}
