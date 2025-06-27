import { registerAs } from '@nestjs/config';
import { ENV } from './../env';

export default registerAs('MONGODB', async () => {
  return {
    TOKEN_DB_USERNAME: ENV.TOKEN_DB_USERNAME,
    TOKEN_DB_PASSWORD: ENV.TOKEN_DB_PASSWORD,
    TOKEN_DB_URI: ENV.TOKEN_DB_URI,
    TRADE_DB_USERNAME: ENV.TRADE_DB_USERNAME,
    TRADE_DB_PASSWORD: ENV.TRADE_DB_PASSWORD,
    TRADE_DB_URI: ENV.TRADE_DB_URI,
  };
});
