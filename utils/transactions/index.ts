import { ethers } from 'ethers';
import { sendEvmAsset } from './evm';
import { sendBitcoinTx } from './bitcoin';

export interface BaseTxParams {
  to: string;
  amount: string | bigint;
  tokenAddress?: string;
  decimals?: number;
  fee?: string | number | bigint;
  memo?: string;
  fromAddress?: string;
}

export interface BitcoinTxParams extends BaseTxParams {
  fromAddress: string;
  fee: string | number | bigint;
}

type SupportedChain = 'ethereum' | 'bitcoin' | 'sui' | 'solana';

type ChainTxHandler = (params: BaseTxParams, privateKey: string) => Promise<string>;

const sendSuiTx = async (params: BaseTxParams, privateKey: string) => {
  return '';
};

const sendSolanaTx = async (params: BaseTxParams, privateKey: string) => {
  return '';
};

const chainTxHandlers: Record<SupportedChain, ChainTxHandler> = {
  ethereum: (params, privateKey) =>
    sendEvmAsset(
      params.tokenAddress ?? ethers.ZeroAddress,
      params.decimals ?? 18,
      params,
      privateKey,
    ),
  bitcoin: (params, privateKey) => {
    if (!params.fromAddress || !params.fee) {
      throw new Error('Bitcoin transaction requires fromAddress and fee!');
    }
    return sendBitcoinTx(
      {
        ...params,
        fromAddress: params.fromAddress,
        fee: params.fee,
      },
      privateKey,
    );
  },
  sui: sendSuiTx,
  solana: sendSolanaTx,
};

export const sendTransaction = async (
  chain: SupportedChain,
  params: BaseTxParams,
  privateKey: string,
): Promise<string> => {
  const handler = chainTxHandlers[chain];
  if (!handler) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  return handler(params, privateKey);
};
