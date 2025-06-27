import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AccountType } from 'src/shared/types/data/account';

export type WalletDocument = Wallet & mongoose.Document;

@Schema({ timestamps: false, versionKey: '_v' })
export class Wallet {
  @Prop()
  account: string;

  @Prop({ type: Date, default: new Date() })
  timestamp: Date;

  @Prop({ enum: AccountType, required: true })
  type: AccountType;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
