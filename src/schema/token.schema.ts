import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type TokenDocument = Token & mongoose.Document;

@Schema({ timestamps: false, versionKey: '_v' })
export class Token {
  @Prop()
  signature: string;

  @Prop()
  mint_pubkey: string;

  @Prop()
  initial_buy_account_pubkey: string;

  @Prop()
  initial_buy_token_account_pubkey: string;

  @Prop()
  creator_pubkey: string;

  @Prop()
  creator_token_account_pubkey: string;

  @Prop()
  initial_buy_amount: number;

  @Prop()
  initial_buy_sol_amount: number;

  @Prop()
  bondingcurve_pubkey: string;

  @Prop()
  market_cap: number;

  @Prop()
  name: string;

  @Prop()
  symbol: string;

  @Prop()
  uri: string;

  @Prop()
  timestamp: Date;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
