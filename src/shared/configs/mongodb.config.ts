import { registerAs } from '@nestjs/config';
import { ENV } from './../env';

export default registerAs('MONGODB', async () => {
  return {
    MONGODB_URI: ENV.MONGODB_URI,
    MONGODB_USERNAME: ENV.MONGODB_USERNAME,
    MONGODB_PASSWORD: ENV.MONGODB_PASSWORD,
  };
});
