import { cleanEnv, str } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

export const ENV = cleanEnv(process.env, {
  HELIUS_API_KEY: str(),
  TOKEN_DB_USERNAME: str(),
  TOKEN_DB_PASSWORD: str(),
  TOKEN_DB_URI: str(),
  TRADE_DB_USERNAME: str(),
  TRADE_DB_PASSWORD: str(),
  TRADE_DB_URI: str(),
  SWAGGER_USERNAME: str(),
  SWAGGER_PASSWORD: str(),
});
