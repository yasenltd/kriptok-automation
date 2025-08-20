import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  ParsedAccountData,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddress,
  createTransferInstruction,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { isDev } from '../constants';
import { base58 } from '@scure/base';
import { SolanaTxParams } from '.';
import { getParsedAccountInBatch } from 'solana-batch-requests';
import { BalanceType } from '@/types';

const SOLANA_RPC = isDev ? 'https://api.testnet.solana.com' : 'https://api.mainnet-beta.solana.com';

export const getSolanaBalance = async (
  address: string,
  tokens: string[],
  connection?: Connection,
): Promise<BalanceType> => {
  try {
    const conn = connection ?? new Connection(SOLANA_RPC);
    const solBalance = await conn.getBalance(new PublicKey(address));

    const tokenAccountAddresses = await Promise.all(
      tokens.map(mint => getAssociatedTokenAddress(new PublicKey(mint), new PublicKey(address))),
    );

    const tokenAccountsData = await Promise.all(
      tokenAccountAddresses.map(addr => getParsedAccountInBatch(conn, addr)),
    );

    const tokenBalances = tokens.map((mint, index) => {
      const accountData = tokenAccountsData[index];
      let balance = '0';

      if (accountData && accountData.data) {
        try {
          const parsed = (accountData.data as ParsedAccountData).parsed;
          balance = (parsed?.info?.tokenAmount?.uiAmount || 0).toString();
        } catch {
          balance = '0';
        }
      }

      return { address: mint, balance };
    });

    return {
      native: (solBalance / LAMPORTS_PER_SOL).toString(),
      tokens: tokenBalances.reduce(
        (acc, token) => {
          acc[token.address] = token.balance;
          return acc;
        },
        {} as Record<string, string>,
      ),
    };
  } catch (error) {
    console.error(error);
    throw new Error('Failed to get balances!');
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
    const balances = await getSolanaBalance(params.fromAddress, [], connection);
    const solBalance = Number(balances.native);
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

export const sendSplToken = async ({
  fromAddress,
  to,
  amount,
  privateKey,
  mintAddress,
}: {
  fromAddress: string;
  to: string;
  amount: number;
  privateKey: string;
  mintAddress: string;
}) => {
  try {
    const connection = new Connection(SOLANA_RPC);
    const senderKeypair = Keypair.fromSecretKey(base58.decode(privateKey));
    const mint = new PublicKey(mintAddress);
    const fromPublicKey = new PublicKey(fromAddress);
    const toPublicKey = new PublicKey(to);

    const fromTokenAccount = await getAssociatedTokenAddress(mint, fromPublicKey);
    const toTokenAccount = await getAssociatedTokenAddress(mint, toPublicKey);

    const ix = createTransferInstruction(
      fromTokenAccount,
      toTokenAccount,
      fromPublicKey,
      amount,
      [],
      TOKEN_PROGRAM_ID,
    );

    const tx = new Transaction().add(ix);
    const latestBlockhash = await connection.getLatestBlockhash();
    tx.feePayer = senderKeypair.publicKey;
    tx.recentBlockhash = latestBlockhash.blockhash;

    const sig = await sendAndConfirmTransaction(connection, tx, [senderKeypair]);
    return sig;
  } catch (e) {
    console.error(e);
    throw new Error('Failed to send SPL token');
  }
};

export const sendSolanaAsset = async (
  tokenMint: string | null,
  decimals: number | undefined,
  params: SolanaTxParams,
  privateKey: string,
): Promise<string> => {
  if (!tokenMint) {
    return sendSolanaTx(params, privateKey);
  }

  if (decimals === undefined) {
    throw new Error('Decimals must be provided for SPL token transfers.');
  }

  return sendSplToken({
    fromAddress: params.fromAddress,
    to: params.to,
    amount: Number(params.amount) * 10 ** decimals,
    privateKey,
    mintAddress: tokenMint,
  });
};
