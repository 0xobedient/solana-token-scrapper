import { registerAs } from '@nestjs/config';
import { ENV } from '../env';

export default registerAs('SWAGGER', async () => {
  return {
    SWAGGER_USERNAME: ENV.SWAGGER_USERNAME,
    SWAGGER_PASSWORD: ENV.SWAGGER_PASSWORD,
  };
});
