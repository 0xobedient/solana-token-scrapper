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

      return res.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  public async getTokenByAddress(mint: string) {
    return this.tokenModel.findOne({ mint_pubkey: mint }).exec();
  }

  public async getTokensByCreator(address: string) {
    return this.tokenModel.find({ creator_pubkey: address }).exec();
  }

  public async getTokensByFirstBuyer(address: string) {
    return this.tokenModel.find({ initial_buy_account_pubkey: address }).exec();
  }

  public async getTokensByMetadata(
    name?: string,
    symbol?: string,
    sort?: 'asc' | 'desc',
    limit?: number,
  ) {
    const safeSort =
      sort !== 'asc'
        ? -1 // desc
        : 1; // asc;

    if (name && symbol) {
      return this.tokenModel
        .find({ name, symbol })
        .sort({ timestamp: safeSort })
        .limit(limit ?? 100)
        .exec();
    } else if (name) {
      return this.tokenModel
        .find({ name })
        .sort({ timestamp: safeSort })
        .limit(limit ?? 100)
        .exec();
    } else if (symbol) {
      return this.tokenModel
        .find({ symbol })
        .sort({ timestamp: safeSort })
        .limit(limit ?? 100)
        .exec();
    }
    return null;
  }

  public async getTokensByDuration(
    start?: string,
    end?: string,
    sort?: 'asc' | 'desc',
    limit?: number,
  ) {
    const safeSort =
      sort !== 'asc'
        ? -1 // desc
        : 1; // asc;

    const startDate = start ? new Date(start) : null;
    const endDate = end ? new Date(end) : null;
    let timestamp = {};

    if (startDate && endDate) {
      timestamp = {
        $gte: startDate,
        $lte: endDate,
      };
    } else if (startDate) {
      timestamp = {
        $gte: startDate,
      };
    } else if (endDate) {
      timestamp = {
        $lte: endDate,
      };
    }
    return this.tokenModel
      .find({ timestamp })
      .sort({ timestamp: safeSort })
      .limit(limit ?? 100)
      .exec();
  }

  public async getTokensByMarketCap(
    min?: number,
    max?: number,
    sort?: 'asc' | 'desc',
    limit?: number,
  ) {
    let market_cap = {};

    const safeSort =
      sort !== 'asc'
        ? -1 // desc
        : 1; // asc;

    if (min !== undefined && max !== undefined) {
      market_cap = {
        $lte: max,
        $gte: min,
      };
    } else if (min !== undefined) {
      market_cap = {
        $gte: min,
      };
    } else if (max !== undefined) {
      market_cap = {
        $lte: max,
      };

      return this.tokenModel;
    }
    return this.tokenModel
      .find({ market_cap })
      .limit(limit ?? 100)
      .sort({ timestamp: safeSort })
      .exec();
  }

  public async getTokenBySignature(signature: string) {
    return this.tokenModel.findOne({ signature }).exec();
  }

  public async getTokensByAddresses(addresses: string[]) {
    const data: Token[] = [];

    for (const address of addresses) {
      const token: Token | null = await this.tokenModel
        .findOne({ mint_pubkey: address })
        .exec();

      if (token) {
        data.push(token);
      }
    }

    return data;
  }

  public async getTokensByCreators(addresses: string[], sort?: 'asc' | 'desc') {
    let data: Token[] = [];

    for (const address of addresses) {
      const tokens: Token[] | null = await this.tokenModel
        .find({ creator_pubkey: address })
        .exec();

      if (tokens) {
        data = data.concat(tokens);
      }
    }

    return data.sort((a: Token, b: Token) => {
      return sort !== 'asc'
        ? b.timestamp.getTime() - a.timestamp.getTime()
        : a.timestamp.getTime() - b.timestamp.getTime();
    });
  }

  public async getTokensByFirstbuyers(
    addresses: string[],
    sort?: 'asc' | 'desc',
  ) {
    let data: Token[] = [];

    for (const address of addresses) {
      const tokens: Token[] | null = await this.tokenModel
        .find({ initial_buy_account_pubkey: address })
        .exec();

      if (tokens) {
        data = data.concat(tokens);
      }
    }

    return data.sort((a: Token, b: Token) => {
      return sort !== 'asc'
        ? b.timestamp.getTime() - a.timestamp.getTime()
        : a.timestamp.getTime() - b.timestamp.getTime();
    });
  }
}
