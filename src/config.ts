import { config } from 'dotenv';
import { Environment } from './infrastructure/adapters/server/server.adapter';

config();

export default {
  SERVER: {
    PORT: Number(process.env.SERVER_PORT) || 8080,
    HOST: process.env.SERVER_HOST || '0.0.0.0',
    CORS: {
      CREDENTIALS: true,
      WHITELIST: [ 'http://localhost:3000', /^https:\/\/.*\.alpaca\.com$/ ],
      MAX_AGE: 3600,
    },
    PUBLIC_URL: process.env.SERVER_URL,
  },
  ENV: process.env.ENV || Environment.DEV,
  DEPLOYMENT_INFO: process.env.DEPLOYMENT_INFO || 'LOCAL',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
  DB: {
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT || '3306',
    DATABASE: process.env.DB_DATABASE || 'alpaca',
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
  },
  TABLES: {
    USER: 'user',
  },
  ENCRYPTION: {
    ALGORITHM: 'aes-256-cbc',
    KEY: process.env.ENCRYPTION_KEY,
    IV: process.env.ENCRYPTION_IV,
  },
};
