import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenSchema } from 'src/schema/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Token', schema: TokenSchema }]),
  ],
  controllers: [],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
