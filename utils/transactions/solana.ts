import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { isDev } from '../constants';
import { base58 } from '@scure/base';
import { SolanaTxParams } from '.';

const SOLANA_RPC = isDev ? 'https://api.testnet.solana.com' : 'https://api.mainnet-beta.solana.com';

export const getSolanaBalance = async (address: string, connection?: Connection) => {
  try {
    const conn = connection ?? new Connection(SOLANA_RPC);
    const publicKey = new PublicKey(address);

    const lamports = await conn.getBalance(publicKey);
    const sol = lamports / LAMPORTS_PER_SOL;

    return sol;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get balance!');
  }
};

export const sendSolanaTx = async (params: SolanaTxParams, privateKey: string) => {
  try {
    const connection = new Connection(SOLANA_RPC);

    const secretKey = base58.decode(privateKey);
    const senderKeypair = Keypair.fromSecretKey(secretKey);
    const recipient = new PublicKey(params.to);

    const amountSOL = parseFloat(params.amount as string);

    if (isNaN(amountSOL)) throw new Error('Invalid amount');

    const lamports = Math.round(amountSOL * LAMPORTS_PER_SOL);

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: senderKeypair.publicKey,
        toPubkey: recipient,
        lamports: Number(lamports),
      }),
    );

    const latestBlockhash = await connection.getLatestBlockhash();
    tx.recentBlockhash = latestBlockhash.blockhash;
    tx.feePayer = senderKeypair.publicKey;
    const message = tx.compileMessage();
    const fee = await connection.getFeeForMessage(message);
    const estimatedFee = fee.value ?? 0;
    const solBalance = await getSolanaBalance(params.fromAddress, connection);
    const balanceLamports = Math.floor(solBalance * LAMPORTS_PER_SOL);

    if (balanceLamports < lamports + estimatedFee) {
      throw new Error('Insufficient balance to cover amount + fee');
    }

    const signature = await sendAndConfirmTransaction(connection, tx, [senderKeypair]);
    return signature;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send SOL!');
  }
};
