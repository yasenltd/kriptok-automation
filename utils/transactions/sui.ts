import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Transaction } from '@mysten/sui/transactions';
import { isDev } from '../constants';
import { SuiTxParams } from '.';

const RPC_URL = isDev ? getFullnodeUrl('testnet') : getFullnodeUrl('mainnet');

const sui = new SuiClient({ url: RPC_URL });

export const getSuiBalance = async (address: string): Promise<number> => {
  const res = await sui.getBalance({ owner: address });
  const balanceBigInt = BigInt(res.totalBalance);
  const suiTotal = Number(balanceBigInt) / 1_000_000_000;
  return suiTotal;
};

export const sendSuiTx = async (params: SuiTxParams, privateKey: string): Promise<string> => {
  const balance = await getSuiBalance(params.fromAddress);
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
