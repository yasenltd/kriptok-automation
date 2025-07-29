import { Wallet, JsonRpcProvider, parseEther, ethers } from 'ethers';
import {
  ERC20_ABI,
  INFURA_ID,
  isDev,
  MAIN_ETH_RPC_PROVIDER,
  TEST_ETH_RPC_PROVIDER,
} from './constants';

interface SendTxParams {
  to: string;
  amount: string | BigInt;
  tokenAddress?: string;
  decimals?: number;
  fee?: string | number | BigInt;
  memo?: string;
}

type SupportedChain = 'ethereum' | 'bitcoin' | 'sui' | 'solana';

export const getWalletProvider = (chain: 'ethereum', privateKey: string) => {
  const rpc = isDev ? TEST_ETH_RPC_PROVIDER[chain] : MAIN_ETH_RPC_PROVIDER[chain];
  const provider = new JsonRpcProvider(rpc);
  const wallet = new Wallet(privateKey, provider);
  return { wallet, provider };
};

export const estimateGasFee = async (
  tokenAddress: string | null,
  decimals: number,
  params: SendTxParams,
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

    //fallback
    const fallbackGasPrice = ethers.parseUnits('10', 'gwei');
    const fallbackGasLimit =
      !tokenAddress || tokenAddress === ethers.ZeroAddress ? 21_000n : 60_000n;

    const fallbackFee = fallbackGasPrice * fallbackGasLimit;

    return {
      feeInWei: fallbackFee,
      feeInEth: ethers.formatEther(fallbackFee),
    };
  }
};

const sendEthereumTx = async (params: SendTxParams, privateKey: string) => {
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
  params: SendTxParams,
  privateKey: string,
) => {
  try {
    const rpc = isDev ? TEST_ETH_RPC_PROVIDER['ethereum'] : MAIN_ETH_RPC_PROVIDER['ethereum'];
    const provider = new JsonRpcProvider(rpc);
    const wallet = new Wallet(privateKey, provider);
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
  params: SendTxParams,
  privateKey: string,
): Promise<string> => {
  if (!INFURA_ID) {
    throw new Error('You need to set infura id in .env!');
  }
  return tokenAddress === ethers.ZeroAddress
    ? sendEthereumTx(params, privateKey)
    : sendErc20Tx(tokenAddress, decimals, params, privateKey);
};

const sendBitcoinTx = async (params: SendTxParams, privateKey: string) => {
  return '';
};

const sendSuiTx = async (params: SendTxParams, privateKey: string) => {
  return '';
};

const sendSolanaTx = async (params: SendTxParams, privateKey: string) => {
  return '';
};

export const sendTransaction = async (
  chain: SupportedChain,
  params: SendTxParams,
  privateKey: string,
): Promise<string> => {
  switch (chain) {
    case 'ethereum':
      return sendEvmAsset(
        params.tokenAddress ?? ethers.ZeroAddress,
        params.decimals ?? 18,
        params,
        privateKey,
      );
    case 'bitcoin':
      return sendBitcoinTx(params, privateKey);
    case 'sui':
      return sendSuiTx(params, privateKey);
    case 'solana':
      return sendSolanaTx(params, privateKey);
    default:
      throw new Error('Unsupported chain');
  }
};
