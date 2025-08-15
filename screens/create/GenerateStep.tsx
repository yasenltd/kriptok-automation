import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/useToast';
import { setUser } from '@/stores/user/userSlice';
import { typography } from '@/theme/typography';
import { IUser } from '@/types';
import {
  deriveAllWalletsFromMnemonic,
  generateMnemonic,
  saveToken,
  storeAllPrivKeys,
  storeWalletSecurely,
} from '@/utils';
import { getLoginMessage, getSignupMessage, login, signSiweMessage, signup } from '@/utils/auth';
import { clearWalletSecurely, setPin } from '@/utils/secureStore';
import { getUser } from '@/utils/users';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { BackHandler, Platform, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';

type Props = {
  pin: string;
  biometricsEnabled: boolean;
};

const GenerateStep = ({ pin, biometricsEnabled }: Props) => {
  const toast = useToast();
  const { setIsAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const { theme } = useTheme();

  const handleGenerateMnemonic = useCallback(async () => {
    try {
      const newMnemonic = generateMnemonic();

      const wallets = deriveAllWalletsFromMnemonic(newMnemonic);

      //store priv keys
      await storeAllPrivKeys({
        eth: wallets.evm.privateKey,
        sol: wallets.solana.privateKey,
        sui: wallets.sui.privateKey,
        btc: wallets.bitcoin.privateKey,
      });

      return { mnemonic: newMnemonic, wallets: wallets };
    } catch (err) {
      console.error('Something went wrong:', err);
      throw new Error('Failed to generate mnemonic');
    }
  }, []);

  const handleSecureSave = useCallback(async () => {
    const { mnemonic, wallets } = await handleGenerateMnemonic();

    try {
      const { message: signupMessage } = await getSignupMessage(wallets.evm.address);
      const signupSignature = await signSiweMessage(signupMessage, wallets.evm.privateKey);
      // signup user
      await signup({
        eth: wallets.evm.address,
        btc: wallets.bitcoin.address,
        sui: wallets.sui.address,
        solana: wallets.solana.address,
        signature: signupSignature,
        message: signupMessage,
      });
      //generate message
      const { message } = await getLoginMessage(wallets.evm.address);
      // sign message
      const signature = await signSiweMessage(message, wallets.evm.privateKey);

      //obtain tokens
      const { access_token, expires_in, refresh_token, refresh_expires_in } = await login(
        message,
        signature,
      );

      await saveToken({
        access_token,
        refresh_token,
        expires_in: expires_in.toString(),
        refresh_expires_in: refresh_expires_in.toString(),
      });

      const user = await getUser();
      const extended = { ...user, biometricsEnabled: biometricsEnabled } as IUser;
      dispatch(setUser(extended));

      await setPin(pin);

      await storeWalletSecurely(mnemonic);
      setIsAuthenticated(true);
      router.replace('/home');
      toast.showSuccess('Success! Your wallet and PIN are secured.');
    } catch (err) {
      await clearWalletSecurely();
      router.replace('/');
      console.error('Secure store error:', err);
      toast.showError('Failed to save your wallet.');
    }
  }, [pin, biometricsEnabled]);

  useEffect(() => {
    handleSecureSave();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== 'android') return undefined;

      const onBack = () => {
        return true;
      };

      const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
      return () => sub.remove();
    }, []),
  );
  return (
    <View style={styles.root}>
      <View>
        <Text style={[typography['heading5'], styles.title, { color: theme.text.primary }]}>
          Creating a wallet
        </Text>

        <Text
          style={[
            styles.text,
            styles.title,
            { color: theme.text.tertiary, marginTop: 10, alignSelf: 'stretch' },
          ]}
        >
          This might take a few seconds...
        </Text>

        <View style={{ alignItems: 'center', marginTop: 30 }}>
          <View style={styles.loader}>
            <ActivityIndicator size={80} color={'white'} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default GenerateStep;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    marginVertical: 150,
  },
  title: {
    textAlign: 'center',
  },
  text: {
    textAlign: 'center',
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
  },
  loader: {
    width: 120,
    height: 120,
    backgroundColor: '#49505B80',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
