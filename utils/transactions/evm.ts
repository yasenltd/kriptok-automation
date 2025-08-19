import { Wallet, JsonRpcProvider, parseEther, ethers } from 'ethers';
import {
  ERC20_ABI,
  INFURA_ID,
  isDev,
  MAIN_ETH_RPC_PROVIDER,
  TEST_ETH_RPC_PROVIDER,
} from '../constants';
import { BaseTxParams } from '.';
import { Chain } from 'viem/chains';
import { createPublicClient, http } from 'viem';

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

export const getEthBalance = async (address: string, chain: Chain, tokens: string[]) => {
  const ethClient = createPublicClient({
    chain: chain,
    transport: http(),
  });

  const tokenCalls = tokens.flatMap(token => [
    {
      address: token as `0x${string}`,
      abi: [
        {
          inputs: [{ name: 'owner', type: 'address' }],
          name: 'balanceOf',
          outputs: [{ name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function' as const,
        },
      ] as const,
      functionName: 'balanceOf',
      args: [address as `0x${string}`],
    },
    {
      address: token as `0x${string}`,
      abi: [
        {
          inputs: [],
          name: 'decimals',
          outputs: [{ name: '', type: 'uint8' }],
          stateMutability: 'view',
          type: 'function' as const,
        },
      ] as const,
      functionName: 'decimals',
      args: [],
    },
  ]);

  const results = await ethClient.multicall({
    contracts: tokenCalls,
  });

  const tokenData = tokens.map((token, index) => {
    const balanceResult = results[index * 2];
    const decimalsResult = results[index * 2 + 1];
    const balance = balanceResult.result as bigint;
    const decimals = decimalsResult.result as number;
    const formattedBalance = ethers.formatUnits(balance, decimals);

    return {
      token,
      balance: formattedBalance,
    };
  });

  const balanceWei = await ethClient.getBalance({ address: address as `0x${string}` });
  return {
    eth: ethers.formatEther(balanceWei),
    tokens: tokenData,
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
