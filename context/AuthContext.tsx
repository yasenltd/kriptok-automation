import { useBalancePollingAll } from '@/hooks/useBalancePolling';
import { RootState } from '@/stores/store';
import { StatusType } from '@/types';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  status: StatusType;
  setStatus: (val: StatusType) => void;
  forceAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export let externalForceAuth: () => void = () => {};
export const setExternalForceAuth = (fn: () => void) => {
  externalForceAuth = fn;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [status, setStatus] = useState<StatusType>('checking');
  const user = useSelector((state: RootState) => state.user.data);

  useBalancePollingAll({
    eth: user?.address,
    btc: user?.btc,
    sol: user?.solana,
    sui: user?.sui,
  });

  const forceAuth = () => {
    setIsAuthenticated(false);
    setStatus('checking');
  };

  useEffect(() => {
    setExternalForceAuth(forceAuth);
  }, []);
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, status, setStatus, forceAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
