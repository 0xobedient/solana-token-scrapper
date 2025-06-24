import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetRecentTokenDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit?: number;
}

export class GetOldestTokenDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit?: number;
}

export class GetTokensByAddressesDto {
  @IsArray()
  @IsString({ each: true })
  addresses: string[];
}

export class GetTokensByCreatorsDto {
  @IsArray()
  @IsString({ each: true })
  addresses: string[];

  @IsOptional()
  @IsString()
  sort?: 'asc' | 'desc';
}

export class GetTokensByFirstBuyerDto {
  @IsArray()
  @IsString({ each: true })
  addresses: string[];

  @IsOptional()
  @IsString()
  sort?: 'asc' | 'desc';
}

export class GetTokensByMetadataDto {
  @ApiPropertyOptional()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  symbol?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sort?: 'asc' | 'desc';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit?: number;
}

export class GetTokensByDurationDto {
  @ApiPropertyOptional()
  @IsOptional()
  start?: string;

  @ApiPropertyOptional()
  @IsOptional()
  end?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sort?: 'asc' | 'desc';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit?: number;
}

export class GetTokensByMarketCapDto {
  @ApiPropertyOptional()
  @IsOptional()
  min?: number;

  @ApiPropertyOptional()
  @IsOptional()
  max?: number;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sort?: 'asc' | 'desc';

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  limit?: number;
}
