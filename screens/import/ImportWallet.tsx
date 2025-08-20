import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/useToast';
import { setUser } from '@/stores/user/userSlice';
import { typography } from '@/theme/typography';
import { WalletAddresses } from '@/types';
import {
  deriveAllWalletsFromMnemonic,
  saveToken,
  storeAllPrivKeys,
  storeWalletSecurely,
  validateMnemonic,
} from '@/utils';
import {
  getLoginMessage,
  getSignupMessage,
  isRegistered,
  login,
  signSiweMessage,
  signup,
} from '@/utils/auth';
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
  seedPhrase: string;
  setSeedPhrase: (value: string) => void;
  walletName: string;
  setWalletName: (value: string) => void;
  pin: string;
  setPinInput: (value: string) => void;
  biometricsEnabled: boolean;
};

const ImportWallet = ({
  seedPhrase,
  setSeedPhrase,
  walletName,
  setWalletName,
  pin,
  setPinInput,
  biometricsEnabled,
}: Props) => {
  /* Hooks */
  const { theme } = useTheme();
  const { t } = useTranslation();

  const toast = useToast();
  const { setIsAuthenticated } = useAuth();
  const dispatch = useDispatch();

  /* State */
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isRetryLoading, setIsRetryLoading] = useState(false);
  const [isBackLoading, setIsBackLoading] = useState(false);
  const [retryPin, setRetryPin] = useState('');
  const [retryAddresses, setRetryAddresses] = useState<WalletAddresses>({} as WalletAddresses);

  /* Handlers */
  const handleImport = useCallback(async () => {
    const mnemonic = seedPhrase.trim();
    const isValid = validateMnemonic(mnemonic);
    if (isValid) {
      try {
        await storeWalletSecurely(mnemonic);
        const wallets = deriveAllWalletsFromMnemonic(mnemonic);
        const derivedWallets = {
          evm: { address: wallets.evm.address },
          bitcoin: { address: wallets.bitcoin.address },
          solana: { address: wallets.solana.address },
          sui: { address: wallets.sui.address },
        };
        setRetryAddresses(derivedWallets);

        //store priv keys
        await storeAllPrivKeys({
          eth: wallets.evm.privateKey,
          sol: wallets.solana.privateKey,
          sui: wallets.sui.privateKey,
          btc: wallets.bitcoin.privateKey,
        });

        await setPin(pin);

        await handleSecureSave(derivedWallets);
      } catch (error) {
        toast.showError('Error while importing wallet. Try again.');
        console.error(error);

        await clearWalletSecurely();
        router.replace('/');
      }
    } else {
      toast.showError('Invalid mnemonic.');
      await clearWalletSecurely();
      router.replace('/');
    }
  }, [seedPhrase, pin, biometricsEnabled, walletName]);

  const handleSecureSave = useCallback(
    async (wallets: WalletAddresses, retry?: boolean) => {
      try {
        if (retry) setIsRetryLoading(true);

        const privateKey = (await loadPrivkeyFromPin(retry ? retryPin : pin, 'eth')) || '';
        if (!privateKey) {
          toast.showError('Wrong pin. Try again.');
          return;
        }
        const existingUser = await isRegistered(wallets.evm.address);

        if (!existingUser) {
          const { message: signupMessage } = await getSignupMessage(wallets.evm.address);
          const signupSignature = await signSiweMessage(signupMessage, privateKey);
          // signup user
          await signup({
            eth: wallets.evm.address,
            btc: wallets.bitcoin.address,
            sui: wallets.sui.address,
            solana: wallets.solana.address,
            signature: signupSignature,
            message: signupMessage,
          });
        }

        //generate message
        const { message } = await getLoginMessage(wallets.evm.address);
        // sign message
        const signature = await signSiweMessage(message, privateKey);
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
        const extendedUser = {
          ...user,
          biometricsEnabled,
          wallet: { evmAddress: wallets.evm.address, walletName: walletName },
        };
        dispatch(setUser(extendedUser));
        setIsAuthenticated(true);
        setSeedPhrase('');
        setWalletName('');
        router.replace('/home');
        toast.showSuccess('Success! Your wallet and PIN are secured.');
      } catch (err) {
        console.error('Error:', err);
        toast.showError('Could not import your wallet. Try again.');
        setShowErrorModal(true);
      } finally {
        if (retry) setIsRetryLoading(false);
      }
    },
    [pin, biometricsEnabled, walletName, retryAddresses, retryPin],
  );

  const handleGoBack = useCallback(async () => {
    try {
      setIsBackLoading(true);
      await clearWalletSecurely();
      router.replace('/');
    } catch (e) {
      console.error('Go back error:', e);
    } finally {
      setIsBackLoading(false);
      setPinInput('');
    }
  }, []);

  useEffect(() => {
    handleImport();
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
          <Text style={[styles.text, { marginBottom: 20 }]}>{t('wentWrong')}</Text>

          <PinInput
            revertedTheme={true}
            length={6}
            value={retryPin}
            onChange={setRetryPin}
            autoFocus
            cellSize={42}
          />

          <View style={[styles.buttonContainer, { marginTop: 20 }]}>
            <Button
              label={t('goBack')}
              size={'M'}
              onPress={handleGoBack}
              disabled={isRetryLoading}
              loading={isBackLoading}
              variant="accent"
            />
            <Button
              label={t('retry')}
              size={'M'}
              onPress={() => handleSecureSave(retryAddresses, true)}
              loading={isRetryLoading}
              disabled={isRetryLoading}
              variant="secondary"
            />
          </View>
        </AppModal>
      )}
      <View>
        <Text style={[typography['heading5'], styles.title, { color: theme.text.primary }]}>
          {t('importing')}
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

export default ImportWallet;
