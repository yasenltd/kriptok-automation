import 'react-native-get-random-values';
import { Buffer } from 'buffer';

if (typeof (global as any).Buffer === 'undefined') {
  (global as any).Buffer = Buffer;
}
