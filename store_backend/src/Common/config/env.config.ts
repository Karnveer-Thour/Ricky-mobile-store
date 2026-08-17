import {
  DEFAULT_PORT,
  DEFAULT_DB_PORT,
  DEFAULT_DB_HOST,
  FIREBASE_DEFAULTS,
} from '../constants';

export const ENV_KEYS = {
  // Server
  PORT: 'PORT',

  // Database
  DB_TYPE: 'DB_TYPE',
  DB_HOST: 'DB_HOST',
  DB_PORT: 'DB_PORT',
  DB_USERNAME: 'DB_USERNAME',
  DB_PASSWORD: 'DB_PASSWORD',
  DB_DATABASE: 'DB_DATABASE',
  DB_SYNCHRONIZE: 'DB_SYNCHRONIZE',
  DB_LOGGING: 'DB_LOGGING',

  // Security
  JWT_SECRET: 'JWT_SECRET',
  PASSWORD_PEPPER: 'PASSWORD_PEPPER',

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: 'CLOUDINARY_CLOUD_NAME',
  CLOUDINARY_API_KEY: 'CLOUDINARY_API_KEY',
  CLOUDINARY_API_SECRET: 'CLOUDINARY_API_SECRET',

  // Firebase
  TYPE: 'TYPE',
  PROJECT_ID: 'PROJECT_ID',
  PRIVATE_KEY_ID: 'PRIVATE_KEY_ID',
  PRIVATE_KEY: 'PRIVATE_KEY',
  CLIENT_EMAIL: 'CLIENT_EMAIL',
  CLIENT_ID: 'CLIENT_ID',
  AUTH_URI: 'AUTH_URI',
  TOKEN_URI: 'TOKEN_URI',
  AUTH_PROVIDER_X509_CERT_URL: 'AUTH_PROVIDER_X509_CERT_URL',
  CLIENT_X509_CERT_URL: 'CLIENT_X509_CERT_URL',

  // Lenders
  BAJAJ_API_SECRET: 'BAJAJ_API_SECRET',
  HOMECREDIT_API_SECRET: 'HOMECREDIT_API_SECRET',
} as const;

export const ENV_CONFIG = {
  get SERVER() {
    return {
      PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : DEFAULT_PORT,
    };
  },

  get DATABASE() {
    const type = (process.env.DB_TYPE || 'sqlite') as 'postgres' | 'sqlite';
    return {
      TYPE: type,
      HOST: process.env.DB_HOST || DEFAULT_DB_HOST,
      PORT: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : DEFAULT_DB_PORT,
      USERNAME: process.env.DB_USERNAME || 'postgres',
      PASSWORD: process.env.DB_PASSWORD || 'postgres',
      DATABASE: process.env.DB_DATABASE || (type === 'sqlite' ? 'ricky_mobile_store.sqlite' : 'ricky_mobile_store'),
      SYNCHRONIZE: process.env.DB_SYNCHRONIZE !== 'false',
      LOGGING: process.env.DB_LOGGING === 'true',
    };
  },

  get SECURITY() {
    return {
      JWT_SECRET: process.env.JWT_SECRET || 'ricky_mobile_store_secret',
      PASSWORD_PEPPER: process.env.PASSWORD_PEPPER || 'ricky_mobile_store_password_secret',
    };
  },

  get CLOUDINARY() {
    return {
      CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'ricky_mobile_store',
      API_KEY: process.env.CLOUDINARY_API_KEY || '123456789012345',
      API_SECRET: process.env.CLOUDINARY_API_SECRET || 'ricky_mobile_store_cloudinary_secret',
    };
  },

  get FIREBASE() {
    return {
      TYPE: process.env.TYPE || FIREBASE_DEFAULTS.TYPE,
      PROJECT_ID: process.env.PROJECT_ID || FIREBASE_DEFAULTS.PROJECT_ID,
      PRIVATE_KEY_ID: process.env.PRIVATE_KEY_ID || FIREBASE_DEFAULTS.PRIVATE_KEY_ID,
      PRIVATE_KEY: (process.env.PRIVATE_KEY || FIREBASE_DEFAULTS.PRIVATE_KEY).replace(/\\n/g, '\n'),
      CLIENT_EMAIL: process.env.CLIENT_EMAIL || FIREBASE_DEFAULTS.CLIENT_EMAIL,
      CLIENT_ID: process.env.CLIENT_ID || FIREBASE_DEFAULTS.CLIENT_ID,
      AUTH_URI: process.env.AUTH_URI || FIREBASE_DEFAULTS.AUTH_URI,
      TOKEN_URI: process.env.TOKEN_URI || FIREBASE_DEFAULTS.TOKEN_URI,
      AUTH_PROVIDER_X509_CERT_URL: process.env.AUTH_PROVIDER_X509_CERT_URL || FIREBASE_DEFAULTS.AUTH_PROVIDER_X509_CERT_URL,
      CLIENT_X509_CERT_URL: process.env.CLIENT_X509_CERT_URL || FIREBASE_DEFAULTS.CLIENT_X509_CERT_URL,
    };
  },

  get BANKS() {
    return {
      BAJAJ_API_SECRET: process.env.BAJAJ_API_SECRET || 'default-bajaj-secret',
      HOMECREDIT_API_SECRET: process.env.HOMECREDIT_API_SECRET || 'default-hc-secret',
    };
  },
};
