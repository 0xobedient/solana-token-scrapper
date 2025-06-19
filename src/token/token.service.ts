import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from 'src/schema/token.schema';
import {
  HELIUS_API_ENDPOINT,
  HELIUS_API_KEY_QUERY,
  HELIUS_RPC_ENDPOINT,
  PUMPPORTAL_WSS_URI,
} from 'src/shared/constants/endpoint.const';
import { TokenType } from 'src/shared/types/response/token';
import * as WebSocket from 'ws';
import { PublicKey } from '@solana/web3.js';
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import axios from 'axios';
import PQueue from 'p-queue';

@Injectable()
export class TokenService implements OnModuleInit {
  private ws: WebSocket;
  private queue: PQueue;

  constructor(
    @InjectModel('Token')
    private readonly tokenModel: Model<Token>,
  ) {}

  onModuleInit() {
    this.queue = new PQueue({ concurrency: 1 });
    this.connectToWebSocketServer();
  }

  private connectToWebSocketServer() {
    this.ws = new WebSocket(PUMPPORTAL_WSS_URI);

    this.ws.on('open', () => {
      let payload = {
        method: 'subscribeNewToken',
      };
      this.ws.send(JSON.stringify(payload));
      console.log('Connected to WebSocket server');
    });

    this.ws.on('message', async (data: WebSocket.Data) => {
      const token: TokenType = JSON.parse(String(data));

      if (token && 'signature' in token) {
        this.queue.add(() => this.handleData(token));
      }
      console.log(JSON.parse(String(data)));
    });

    this.ws.on('close', () => {
      console.log('WebSocket connection closed. Reconnecting...');
      setTimeout(() => this.connectToWebSocketServer(), 5000);
    });

    this.ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  }

  private async handleData(token: TokenType) {
    // const creation = await this.getTokenCreation(token.signature, token.mint);

    // console.log('creation', creation);

    const trader_token_account_pubkey = await getAssociatedTokenAddress(
      new PublicKey(token.mint),
      new PublicKey(token.traderPublicKey),
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID,
    );

    this.saveData({
      creator_pubkey: token.traderPublicKey,
      creator_token_account_pubkey: trader_token_account_pubkey.toBase58(),
      mint_pubkey: token.mint,
      initial_buy_account_pubkey: token.traderPublicKey,
      initial_buy_token_account_pubkey: trader_token_account_pubkey.toBase58(),
      initial_buy_amount: token.initialBuy,
      initial_buy_sol_amount: token.solAmount,
      bondingcurve_pubkey: token.bondingCurveKey,
      market_cap: token.marketCapSol,
      timestamp: new Date(),
      signature: token.signature,
      name: token.name,
      symbol: token.symbol,
      uri: token.uri,
    });
  }

  private async saveData(data: Token) {
    this.tokenModel.create({ ...data });
    await new Promise((res) => setTimeout(res, 100));
  }

  public async getTokenCreation(signature: string, mint: string) {
    try {
      const transaction = await this.getTransaction([signature]);
      console.log('transaction', transaction);

      await new Promise((res) => setTimeout(res, 100));
      if (!transaction) return null;

      // const creatorPubkey =
      //   transaction.transaction.message.accountKeys[0].pubkey.toBase58();

      // const creatorTokenAccountPubkey = await getAssociatedTokenAddress(
      //   new PublicKey(mint),
      //   new PublicKey(creatorPubkey),
      //   false,
      //   TOKEN_PROGRAM_ID,
      //   ASSOCIATED_TOKEN_PROGRAM_ID,
      // );

      // return {
      //   creatorPubkey,
      //   creatorTokenAccountPubkey: creatorTokenAccountPubkey.toBase58(),
      // };
    } catch (error) {
      console.error(error);

      return null;
    }
  }

  public async getTransaction(signatures: string[]) {
    try {
      const client = axios.create({
        baseURL: HELIUS_API_ENDPOINT,
      });

      const res = await client.post('/v0/transactions' + HELIUS_API_KEY_QUERY, {
        transactions: signatures,
      });

      console.log(res.data);

      return res.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
