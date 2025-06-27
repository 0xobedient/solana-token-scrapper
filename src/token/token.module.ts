import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from 'src/schema/token.schema';
import { TokenController } from './token.controller';
import { TOKEN_DB, TRADE_DB } from 'src/shared/constants/db.const';
import { WalletSchema } from 'src/schema/wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Token', schema: TokenSchema }],
      TOKEN_DB,
    ),
    MongooseModule.forFeature(
      [{ name: 'Wallet', schema: WalletSchema }],
      TRADE_DB,
    ),
  ],
  controllers: [TokenController],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
