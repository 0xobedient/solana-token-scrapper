import { registerAs } from '@nestjs/config';
import { ENV } from '../env';

export default registerAs('ONCHAIN', async () => {
  return {
    HELIUS_API_KEY: ENV.HELIUS_API_KEY,
  };
});
