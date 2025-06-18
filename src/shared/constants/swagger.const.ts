import { ENV } from '../env';

export const SWAGGER_BASIC_AUTH = {
  USERNAME: ENV.SWAGGER_USERNAME,
  PASSWORD: ENV.SWAGGER_PASSWORD,
} as const;
