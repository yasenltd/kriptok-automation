import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { isDev } from '../constants';
import { SuiTxParams } from '.';
import { BalanceType } from '@/types';

const RPC_URL = isDev ? getFullnodeUrl('testnet') : getFullnodeUrl('mainnet');

const sui = new SuiClient({ url: RPC_URL });

export const getSuiBalance = async (address: string, tokens: string[]): Promise<BalanceType> => {
  const suiToken = '0x2::sui::SUI';
  try {
    const allBalances = await sui.getAllBalances({
      owner: address,
    });

    const suiBalance = allBalances.find(token => token.coinType === suiToken);
    const tokensBalances = allBalances
      .filter(token => tokens.includes(token.coinType))
      .map(token => ({
        token: token.coinType,
        balance: Number(token.totalBalance) / 1_000_000_000,
      }));

    const suiTotal = suiBalance ? Number(suiBalance?.totalBalance) / 1_000_000_000 : 0;
    return {
      native: suiTotal.toString() || '0',
      tokens: tokensBalances.reduce(
        (acc, token) => {
          acc[token.token] = token.balance.toString();
          return acc;
        },
        {} as Record<string, string>,
      ),
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get SUI balance');
  }
};

export const sendSuiTx = async (params: SuiTxParams, privateKey: string): Promise<string> => {
  const { native: balanceStr } = await getSuiBalance(params.fromAddress, []);
  const balance = Number(balanceStr);
  const amountSui = parseFloat(params.amount as string);
  if (isNaN(amountSui) || amountSui <= 0) {
    throw new Error('Invalid amount');
  }
  if (balance < amountSui) {
    console.error('Not enough SUI balance');
    throw new Error('Insufficient SUI balance');
  }

  try {
    const keypair = Ed25519Keypair.fromSecretKey(Uint8Array.from(Buffer.from(privateKey, 'hex')));

    const tx = new Transaction();
    tx.setSender(params.fromAddress);
    tx.transferObjects([tx.gas], tx.pure.address(params.to));
    tx.setGasBudget(100_000_000);

    const result = await sui.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
      options: { showEffects: true },
    });
    console.log('DIGEST: ', result.digest);
    return result.digest;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send SUI');
  }
};
