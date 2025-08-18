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
import { clearWalletSecurely, loadPrivkeyFromPin, setPin } from '@/utils/secureStore';
import { getUser } from '@/utils/users';
import AppModal from '@components/ui/AppModal';
import PinInput from '@components/ui/AppPinInput';
import Button from '@components/ui/Button';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler, Platform, StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useDispatch } from 'react-redux';

type Props = {
  pin: string;
  biometricsEnabled: boolean;
};
type DerivedWallets = {
  evm: { address: string; privateKey: string };
  bitcoin: { address: string; privateKey: string };
  solana: { address: string; privateKey: string };
  sui: { address: string; privateKey: string };
};

const GenerateStep = ({ pin, biometricsEnabled }: Props) => {
  const toast = useToast();
  const { setIsAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [publicAddresses, setPublicAddresses] = useState({ eth: '', sol: '', sui: '', btc: '' });

  const handleGenerateMnemonic = useCallback(async () => {
    try {
      const newMnemonic = generateMnemonic();

      const wallets = deriveAllWalletsFromMnemonic(newMnemonic);

      await setPin(pin);
      await storeWalletSecurely(newMnemonic);

      setPublicAddresses({
        eth: wallets.evm.privateKey,
        sol: wallets.solana.privateKey,
        sui: wallets.sui.privateKey,
        btc: wallets.bitcoin.privateKey,
      });

      //store priv keys
      await storeAllPrivKeys({
        eth: wallets.evm.privateKey,
        sol: wallets.solana.privateKey,
        sui: wallets.sui.privateKey,
        btc: wallets.bitcoin.privateKey,
      });

      return { wallets: wallets };
    } catch (err) {
      await clearWalletSecurely();
      router.replace('/');
      console.error('Something went wrong:', err);
      toast.showError('Failed to save your wallet.');
      return { wallets: {} as DerivedWallets };
    }
  }, [pin]);

  const handleSecureSave = useCallback(async () => {
    try {
      const { wallets } = await handleGenerateMnemonic();

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
      setIsAuthenticated(true);
      router.replace('/home');
      toast.showSuccess('Success! Your wallet and PIN are secured.');
    } catch (err) {
      console.error('Secure store error:', err);
      setShowErrorModal(true);
    }
  }, [pin, biometricsEnabled]);

  const retryFlowWithPin = useCallback(
    async (input: string) => {
      const privKey = await loadPrivkeyFromPin(input, 'eth');
      if (!privKey) {
        toast.showError('Wrong pin. Try again.');
        return;
      }
      setIsLoading(true);
      try {
        const { message: signupMessage } = await getSignupMessage(publicAddresses.eth);
        const signupSignature = await signSiweMessage(signupMessage, privKey);
        // signup user
        await signup({
          eth: publicAddresses.eth,
          btc: publicAddresses.btc,
          sui: publicAddresses.sui,
          solana: publicAddresses.sol,
          signature: signupSignature,
          message: signupMessage,
        });
        //generate message
        const { message } = await getLoginMessage(publicAddresses.eth);
        // sign message
        const signature = await signSiweMessage(message, privKey);

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
        setIsAuthenticated(true);
        router.replace('/home');
        toast.showSuccess('Success! Your wallet and PIN are secured.');
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
        setPinInput('');
      }
    },
    [
      biometricsEnabled,
      publicAddresses.eth,
      publicAddresses.btc,
      publicAddresses.sol,
      publicAddresses.sui,
    ],
  );

  const handleGoBack = useCallback(async () => {
    try {
      setIsLoading(true);
      await clearWalletSecurely();
      router.replace('/');
    } catch (e) {
      console.error('Go back error:', e);
    } finally {
      setIsLoading(false);
      setPinInput('');
    }
  }, []);

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
      {showErrorModal && (
        <AppModal
          visible={showErrorModal}
          onClose={() => {}}
          title="We couldn't finish securing your wallet"
          canClose={false}
          width="screen"
        >
          <Text style={[styles.text, { marginBottom: 20 }]}>
            Something went wrong while saving your wallet. Please, try again.
          </Text>

          <PinInput
            revertedTheme={true}
            length={6}
            value={pinInput}
            onChange={setPinInput}
            autoFocus
            cellSize={42}
          />

          <View style={[styles.buttonContainer, { marginTop: 20 }]}>
            <Button
              label="Go Back"
              size={'M'}
              onPress={handleGoBack}
              disabled={isLoading}
              variant="secondary"
            />
            <Button
              label="Retry"
              size={'M'}
              onPress={() => retryFlowWithPin(pinInput)}
              loading={isLoading}
              variant="accent"
            />
          </View>
        </AppModal>
      )}
      <View>
        <Text style={[typography['heading5'], styles.title, { color: theme.text.primary }]}>
          {t('creating')}
        </Text>

        <Text
          style={[
            styles.text,
            styles.title,
            { color: theme.text.tertiary, marginTop: 10, alignSelf: 'stretch' },
          ]}
        >
          {t('mightTake')}
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
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
});
