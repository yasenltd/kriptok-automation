import { Wallet, JsonRpcProvider, parseEther, ethers } from 'ethers';
import * as bitcoin from 'bitcoinjs-lib';
import * as ECPairFactory from 'ecpair';
import * as ecc from '@bitcoinerlab/secp256k1';
import {
  BITCOIN_NETWORK,
  ERC20_ABI,
  INFURA_ID,
  isDev,
  MAIN_ETH_RPC_PROVIDER,
  TEST_ETH_RPC_PROVIDER,
} from './constants';
import { getPublicRaw, postPublicRaw } from '@/services/apiClient';

interface BaseTxParams {
  to: string;
  amount: string | BigInt;
  tokenAddress?: string;
  decimals?: number;
  fee?: string | number | BigInt;
  memo?: string;
  fromAddress?: string;
}

interface BitcoinTxParams extends BaseTxParams {
  fromAddress: string;
}
interface BitcoinUtxo {
  txid: string;
  vout: number;
  value: number;
  status?: any;
  scriptpubkey: string;
}

type SupportedChain = 'ethereum' | 'bitcoin' | 'sui' | 'solana';

type ChainTxHandler = (params: BaseTxParams, privateKey: string) => Promise<string>;

const providerCache: Record<string, JsonRpcProvider> = {};

export const getWalletProvider = (chain: 'ethereum', privateKey: string) => {
  const rpc = isDev ? TEST_ETH_RPC_PROVIDER[chain] : MAIN_ETH_RPC_PROVIDER[chain];
  if (!providerCache[rpc]) {
    providerCache[rpc] = new JsonRpcProvider(rpc);
  }

  const provider = providerCache[rpc];
  const wallet = new Wallet(privateKey, provider);
  return { wallet, provider };
};

const getFallbackFee = (tokenAddress: string | null): { feeInWei: bigint; feeInEth: string } => {
  const fallbackGasPrice = ethers.parseUnits('10', 'gwei');
  const fallbackGasLimit = !tokenAddress || tokenAddress === ethers.ZeroAddress ? 21_000n : 60_000n;

  const fallbackFee = fallbackGasPrice * fallbackGasLimit;

  return {
    feeInWei: fallbackFee,
    feeInEth: ethers.formatEther(fallbackFee),
  };
};

export const estimateGasFee = async (
  tokenAddress: string | null,
  decimals: number,
  params: BaseTxParams,
  privateKey: string,
): Promise<{ feeInWei: bigint; feeInEth: string }> => {
  try {
    const { wallet, provider } = getWalletProvider('ethereum', privateKey);

    const { gasPrice } = await provider.getFeeData();
    if (!gasPrice) throw new Error('Could not fetch gas price');

    let gasLimit: bigint;

    if (!tokenAddress || tokenAddress === ethers.ZeroAddress) {
      gasLimit = await provider.estimateGas({
        from: wallet.address,
        to: params.to,
        value: parseEther(params.amount.toString()),
      });
    } else {
      const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);
      const amount = ethers.parseUnits(params.amount.toString(), decimals);
      const transferFn = contract.getFunction('transfer');
      gasLimit = await transferFn.estimateGas(params.to, amount);
    }

    const totalFee = gasPrice * gasLimit;
    return {
      feeInWei: totalFee,
      feeInEth: ethers.formatEther(totalFee),
    };
  } catch (error) {
    console.error(error);
    return getFallbackFee(tokenAddress);
  }
};

const sendNativeEvmTx = async (params: BaseTxParams, privateKey: string) => {
  try {
    const { wallet } = getWalletProvider('ethereum', privateKey);

    const tx = await wallet.sendTransaction({
      to: params.to,
      value: parseEther(params.amount as string),
    });
    return tx.hash;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send ETH');
  }
};

const sendErc20Tx = async (
  tokenAddress: string,
  decimals: number,
  params: BaseTxParams,
  privateKey: string,
) => {
  try {
    const { wallet } = getWalletProvider('ethereum', privateKey);
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

    const amount = ethers.parseUnits(params.amount.toString(), decimals);
    const tx = await contract.transfer(params.to, amount);
    return tx.hash;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to send token');
  }
};

export const sendEvmAsset = async (
  tokenAddress: string,
  decimals: number,
  params: BaseTxParams,
  privateKey: string,
): Promise<string> => {
  if (!INFURA_ID) {
    throw new Error('You need to set infura id in .env!');
  }
  return tokenAddress === ethers.ZeroAddress
    ? sendNativeEvmTx(params, privateKey)
    : sendErc20Tx(tokenAddress, decimals, params, privateKey);
};

const fetchUtxos = async (address: string): Promise<BitcoinUtxo[]> => {
  const res = await getPublicRaw(`https://mempool.space/api/address/${address}/utxo`);
  return res.data as BitcoinUtxo[];
};

const sendBitcoinTx = async (params: BitcoinTxParams, privateKeyWIF: string): Promise<string> => {
  try {
    const ECPair = ECPairFactory.ECPairFactory(ecc);
    const keyPair = ECPair.fromWIF(privateKeyWIF, BITCOIN_NETWORK);
    const fromAddress = params.fromAddress;
    const toAddress = params.to;
    const amountToSend = BigInt(params.amount.toString());
    const feeOverride = params.fee ? BigInt(params.fee.toString()) : null;

    const utxos = await fetchUtxos(fromAddress);

    let totalInput = 0n;
    const psbt = new bitcoin.Psbt({ network: BITCOIN_NETWORK });

    for (const utxo of utxos) {
      totalInput += BigInt(utxo.value);
      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script: Buffer.from(utxo.scriptpubkey, 'hex'),
          value: Number(utxo.value),
        },
      });

      if (totalInput >= amountToSend + 200n) break;
    }

    const fee = feeOverride ?? BigInt(10 + psbt.inputCount * 180 + 2 * 34) * 5n;

    const change = totalInput - amountToSend - fee;
    if (change < 0n) throw new Error('Insufficient funds for fee');

    psbt.addOutput({ address: toAddress, value: Number(amountToSend) });

    if (change > 546n) {
      psbt.addOutput({ address: fromAddress, value: Number(change) });
    }

    for (let i = 0; i < psbt.inputCount; i++) {
      psbt.signInput(i, keyPair as unknown as bitcoin.Signer);
    }

    psbt.finalizeAllInputs();
    const rawTx = psbt.extractTransaction().toHex();

    const broadcast = await postPublicRaw(`https://mempool.space/api/tx`, { body: rawTx });
    console.log(rawTx);
    console.log(broadcast.data);
    return broadcast.data as string;
  } catch (err) {
    console.error(err);
    throw new Error('Failed to send Bitcoin transaction');
  }
};

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
    if (!params.fromAddress) {
      throw new Error('Bitcoin transaction requires fromAddress');
    }
    return sendBitcoinTx(
      {
        ...params,
        fromAddress: params.fromAddress,
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
