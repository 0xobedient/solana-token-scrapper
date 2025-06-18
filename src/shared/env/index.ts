import { cleanEnv, str } from 'envalid';
import * as dotenv from 'dotenv';

dotenv.config();

export const ENV = cleanEnv(process.env, {
  HELIUS_API_KEY: str(),
  MONGODB_URI: str(),
  MONGODB_USERNAME: str(),
  MONGODB_PASSWORD: str(),
  SWAGGER_USERNAME: str(),
  SWAGGER_PASSWORD: str(),
});
