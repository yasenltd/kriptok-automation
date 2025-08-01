import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory, { ECPairInterface } from 'ecpair';
import * as ecc from '@bitcoinerlab/secp256k1';
import { BITCOIN_NETWORK, isDev } from '../constants';
import { getPublicRaw, postPublicRaw } from '@/services/apiClient';
import axios from 'axios';
import { BitcoinTxParams } from '.';

bitcoin.initEccLib(ecc as any);
const ECPair = ECPairFactory(ecc);

const DUST_LIMIT = 546n;

interface BitcoinUtxo {
  txid: string;
  vout: number;
  value: number;
  status?: any;
  scriptpubkey: string;
}

const fetchUtxos = async (address: string): Promise<BitcoinUtxo[]> => {
  const baseUrl = isDev ? 'https://mempool.space/testnet/api' : 'https://mempool.space/api';
  const res = await getPublicRaw(`${baseUrl}/address/${address}/utxo`);
  return res.data as BitcoinUtxo[];
};

const toSigner = (keyPair: ECPairInterface): bitcoin.Signer => {
  return {
    publicKey: Buffer.from(keyPair.publicKey),
    sign: (hash: Buffer) => Buffer.from(keyPair.sign(hash)),
  };
};

export const getBitcoinBalance = async (address: string): Promise<bigint> => {
  const utxos = await fetchUtxos(address);
  return utxos.reduce((sum, utxo) => sum + BigInt(utxo.value), 0n);
};

const fetchScriptPubKey = async (txid: string, vout: number): Promise<string> => {
  const baseUrl = isDev ? 'https://mempool.space/testnet/api' : 'https://mempool.space/api';

  const res = await getPublicRaw<{
    vout: { scriptpubkey: string }[];
  }>(`${baseUrl}/tx/${txid}`);

  return res.data.vout[vout].scriptpubkey;
};

export const sendBitcoinTx = async (
  params: BitcoinTxParams,
  privateKey: string,
): Promise<string> => {
  const { fromAddress, to: toAddress, amount, fee } = params;

  const amountSats = BigInt(Math.floor(parseFloat(amount.toString()) * 1e8));

  const feeRate = BigInt(fee);
  try {
    const keyPair = ECPair.fromWIF(privateKey, BITCOIN_NETWORK);
    const derivedAddress = bitcoin.payments.p2wpkh({
      pubkey: Buffer.from(keyPair.publicKey),
      network: BITCOIN_NETWORK,
    }).address;

    if (derivedAddress !== fromAddress) {
      throw new Error('Private key does not match fromAddress');
    }

    const utxos = await fetchUtxos(fromAddress);

    const psbt = new bitcoin.Psbt({ network: BITCOIN_NETWORK });
    let totalInput = 0n;

    for (const utxo of utxos) {
      const scriptHex = await fetchScriptPubKey(utxo.txid, utxo.vout);
      const script = Buffer.from(scriptHex, 'hex');

      psbt.addInput({
        hash: utxo.txid,
        index: utxo.vout,
        witnessUtxo: {
          script,
          value: utxo.value,
        },
      });

      totalInput += BigInt(utxo.value);
      if (totalInput >= amountSats + 500n) break;
    }

    const inputCount = psbt.inputCount;
    const estimatedSize = 10n + BigInt(inputCount) * 148n + 2n * 34n;
    const feeTotal = estimatedSize * feeRate;

    if (totalInput < amountSats + feeTotal) {
      const sendable = totalInput - feeTotal;

      if (sendable < DUST_LIMIT) throw new Error('Insufficient funds after fee (dust)');

      psbt.addOutput({ address: toAddress, value: Number(sendable) });
    } else {
      psbt.addOutput({ address: toAddress, value: Number(amountSats) });

      const change = totalInput - amountSats - feeTotal;
      if (change >= DUST_LIMIT) {
        psbt.addOutput({ address: fromAddress, value: Number(change) });
      }
    }

    for (let i = 0; i < inputCount; i++) {
      psbt.signInput(i, toSigner(keyPair));
    }

    psbt.finalizeAllInputs();

    const rawTx = psbt.extractTransaction().toHex();

    const broadcast = await postPublicRaw(
      `https://mempool.space/${isDev ? 'testnet/' : ''}api/tx`,
      {
        body: rawTx,
        headers: {
          'Content-Type': 'text/plain',
        },
      },
    );
    console.log('BROADCAST DATA: ', broadcast.data);
    return broadcast.data as string;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`failed:`, {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
    } else {
      console.error(error);
    }
    throw new Error('Failed to send BTC');
  }
};
