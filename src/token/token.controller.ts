import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Token')
@Controller('/api/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('mint/:address')
  get_token_by_address(@Param('address') address: string) {
    return this.tokenService.getTokenByAddress(address);
  }

  @Get('creator/:address')
  get_tokens_by_creator(@Param('address') address: string) {
    return this.tokenService.getTokensByCreator(address);
  }

  @Get('first-buyer/:address')
  get_tokens_by_firstbuyer(@Param('address') address: string) {
    return this.tokenService.getTokensByFirstBuyer(address);
  }

  @Get('metadata')
  get_tokens_by_metadata(
    @Query('name') name: string,
    @Query('symbol') symbol: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('limit') limit?: number,
  ) {
    return this.tokenService.getTokensByMetadata(name, symbol, sort, limit);
  }

  @Get('duration')
  get_tokens_by_duration(
    @Query('start') start?: string,
    @Query('end') end?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('limit') limit?: number,
  ) {
    return this.tokenService.getTokensByDuration(start, end, sort, limit);
  }

  @Get('market-cap')
  get_tokens_by_marketcap(
    @Query('min') min?: number,
    @Query('max') max?: number,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('limit') limit?: number,
  ) {
    return this.tokenService.getTokensByMarketCap(min, max, sort, limit);
  }

  @Get('signature/:signature')
  get_token_by_signature(@Param('signature') signature: string) {
    return this.tokenService.getTokenBySignature(signature);
  }

  @Post('mints')
  get_tokens_by_addresses(
    @Body()
    data: {
      addresses: string[];
    },
  ) {
    return this.tokenService.getTokensByAddresses(data.addresses);
  }

  @Post('creators')
  get_tokens_by_creators(
    @Body()
    data: {
      addresses: string[];
      sort?: 'asc' | 'desc';
    },
  ) {
    return this.tokenService.getTokensByCreators(data.addresses, data.sort);
  }

  @Post('first-buyers')
  get_tokens_by_firstbuyers(
    @Body()
    data: {
      addresses: string[];
      sort?: 'asc' | 'desc';
    },
  ) {
    return this.tokenService.getTokensByFirstbuyers(data.addresses, data.sort);
  }
}
