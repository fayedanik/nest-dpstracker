export interface IAppConfig {
  TENANT: string;
  TENANT_ID: string;
  PORT: number;
  MONGO_HOST: string;
  MONGO_PORT: number;
  MONGO_CONNECTION_STRING: string;
  JWT_ACCESS_SECRET: string;
  ACCESS_TOKEN_EXPIRTY_IN_MINUTES: number; // in minutes
  REFRESH_TOKEN_EXPIRTY_IN_DAYS: number; // in days
  database: {
    uri: string;
  };
}
export const APP_CONFIG = Symbol('APP_CONFIG');
