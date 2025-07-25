import { deriveEVMWalletFromMnemonic, loadWalletSecurelyWithBiometrics, saveToken } from '@/utils';
import UnlockModal from '@components/UnlockModal';
import { usePathname, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { loadWalletFromPin } from '@/utils/secureStore';
import AppLoader from '@components/ui/AppLoader';
import { getLoginMessage, login, signSiweMessage } from '@/utils/auth';
import { useAuth } from '@/context/AuthContext';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const { isAuthenticated, setIsAuthenticated, status, setStatus } = useAuth();

  const [showPinModal, setShowPinModal] = useState(false);

  const router = useRouter();
  const pathname = usePathname();

  const isWelcomeScreen = useMemo(() => {
    return pathname === '/';
  }, [pathname]);

  const autoLogin = async (mnemonic: string) => {
    try {
      const { address, privateKey } = deriveEVMWalletFromMnemonic(mnemonic);

      const messageRes = await getLoginMessage(address);
      const signature = await signSiweMessage(messageRes.message, privateKey);

      const { access_token, expires_in, refresh_token, refresh_expires_in } = await login(
        messageRes.message,
        signature,
      );
      await saveToken({
        access_token,
        refresh_token,
        expires_in: expires_in.toString(),
        refresh_expires_in: refresh_expires_in.toString(),
      });

      if (isWelcomeScreen) {
        setIsAuthenticated(true);
        router.replace('/home');
        setStatus('unlocked');
      } else {
        setIsAuthenticated(true);
        setStatus('unlocked');
      }
    } catch (err) {
      console.error('Auto-login failed:', err);
    } finally {
      setShowPinModal(false);
    }
  };

  const runGuard = async () => {
    const stored = await SecureStore.getItemAsync('wallet-credentials');
    if (!stored && isWelcomeScreen) {
      setStatus('unlocked');
      return;
    }

    const mnemonic = await loadWalletSecurelyWithBiometrics();
    if (mnemonic) {
      await autoLogin(mnemonic);
      return;
    }

    setStatus('unlocking');
    setShowPinModal(true);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      runGuard();
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated === false && status !== 'unlocked') {
      runGuard();
    }
  }, [isAuthenticated]);

  const handlePinUnlock = async (pin: string) => {
    const mnemonic = await loadWalletFromPin(pin);
    if (!mnemonic) {
      //TODO :
      //retry ?
      //setStatus('unlocked');
      return;
    }
    await autoLogin(mnemonic);
    setShowPinModal(false);
  };

  if (status === 'checking') return <AppLoader />;

  return (
    <>
      {showPinModal && (
        <UnlockModal
          modalVisible={showPinModal}
          setModalVisible={setShowPinModal}
          pin={pin}
          setPin={setPin}
          confirmPin={confirmPin}
          setConfirmPin={setConfirmPin}
          handleUnlock={() => handlePinUnlock(pin)}
        />
      )}
      {status === 'unlocked' && isAuthenticated && children}
    </>
  );
};

export default AuthGuard;
