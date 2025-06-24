import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiTags } from '@nestjs/swagger';
import {
  GetOldestTokenDto,
  GetRecentTokenDto,
  GetTokensByAddressesDto,
  GetTokensByCreatorsDto,
  GetTokensByDurationDto,
  GetTokensByFirstBuyerDto,
  GetTokensByMarketCapDto,
  GetTokensByMetadataDto,
} from './token.dto';

@ApiTags('Token')
@Controller('/api/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('recent')
  get_recent_tokens(@Query() query: GetRecentTokenDto) {
    const { limit } = query;
    return this.tokenService.getRecentTokens(limit);
  }

  @Get('oldest')
  get_oldest_tokens(@Query() query: GetOldestTokenDto) {
    const { limit } = query;
    return this.tokenService.getOldestTokens(limit);
  }

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
  get_tokens_by_metadata(@Query() query: GetTokensByMetadataDto) {
    const { name, symbol, sort, limit } = query;
    return this.tokenService.getTokensByMetadata(name, symbol, sort, limit);
  }

  @Get('duration')
  get_tokens_by_duration(@Query() query: GetTokensByDurationDto) {
    const { start, end, sort, limit } = query;
    return this.tokenService.getTokensByDuration(start, end, sort, limit);
  }

  @Get('market-cap')
  get_tokens_by_marketcap(@Query() query: GetTokensByMarketCapDto) {
    const { min, max, sort, limit } = query;
    return this.tokenService.getTokensByMarketCap(min, max, sort, limit);
  }

  @Get('signature/:signature')
  get_token_by_signature(@Param('signature') signature: string) {
    return this.tokenService.getTokenBySignature(signature);
  }

  @Post('mints')
  get_tokens_by_addresses(
    @Body()
    data: GetTokensByAddressesDto,
  ) {
    return this.tokenService.getTokensByAddresses(data.addresses);
  }

  @Post('creators')
  get_tokens_by_creators(
    @Body()
    data: GetTokensByCreatorsDto,
  ) {
    return this.tokenService.getTokensByCreators(data.addresses, data.sort);
  }

  @Post('first-buyers')
  get_tokens_by_firstbuyers(
    @Body()
    data: GetTokensByFirstBuyerDto,
  ) {
    return this.tokenService.getTokensByFirstbuyers(data.addresses, data.sort);
  }
}
