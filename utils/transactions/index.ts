import { ethers } from 'ethers';
import { EvmChains, sendEvmAsset } from './evm';
import { sendBitcoinTx } from './bitcoin';
import { sendSuiTx } from './sui';
import { sendSolanaAsset } from './solana';

export interface BaseTxParams {
  to: string;
  amount: string | bigint;
  tokenAddress?: string;
  decimals?: number;
  fee?: string | number | bigint;
  memo?: string;
  fromAddress?: string;
  chain?: EvmChains;
}

export interface BitcoinTxParams extends BaseTxParams {
  fromAddress: string;
  fee: string | number | bigint;
}

export interface SolanaTxParams extends BaseTxParams {
  fromAddress: string;
}

export interface SuiTxParams extends BaseTxParams {
  fromAddress: string;
}

type SupportedChain = 'ethereum' | 'bitcoin' | 'sui' | 'solana' | 'polygon' | 'bsc';

type ChainTxHandler = (params: BaseTxParams, privateKey: string) => Promise<string>;

const chainTxHandlers: Record<SupportedChain, ChainTxHandler> = {
  ethereum: (params, privateKey) => {
    if (!params.chain) {
      console.warn('EVM transaction requires chain param!');
      throw new Error('EVM transaction requires chain param!');
    }
    return sendEvmAsset(
      params.tokenAddress ?? ethers.ZeroAddress, // native or erc20 token
      params.decimals ?? 18,
      params,
      privateKey,
      params.chain,
    );
  },
  polygon: (params, privateKey) => {
    if (!params.chain) {
      console.warn('EVM transaction requires chain param!');
      throw new Error('EVM transaction requires chain param!');
    }
    return sendEvmAsset(
      params.tokenAddress ?? ethers.ZeroAddress, // native or erc20 token
      params.decimals ?? 18,
      params,
      privateKey,
      params.chain,
    );
  },
  bsc: (params, privateKey) => {
    if (!params.chain) {
      console.warn('EVM transaction requires chain param!');
      throw new Error('EVM transaction requires chain param!');
    }
    return sendEvmAsset(
      params.tokenAddress ?? ethers.ZeroAddress, // native or erc20 token
      params.decimals ?? 18,
      params,
      privateKey,
      params.chain,
    );
  },
  bitcoin: (params, privateKey) => {
    if (!params.fromAddress || !params.fee) {
      console.warn('Bitcoin transaction requires fromAddress and fee!');
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
  sui: (params, privateKey) => {
    if (!params.fromAddress) {
      console.warn('Sui transaction requires fromAddress!');

      throw new Error('Sui transaction requires fromAddress!');
    }
    return sendSuiTx({ ...params, fromAddress: params.fromAddress }, privateKey);
  },
  solana: (params, privateKey) => {
    if (!params.fromAddress) {
      console.warn('Solana transaction requires fromAddress!');
      throw new Error('Solana transaction requires fromAddress!');
    }

    return sendSolanaAsset(
      params.tokenAddress ?? null, // null means native SOL
      params.decimals ?? 6,
      { ...params, fromAddress: params.fromAddress },
      privateKey,
    );
  },
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
