import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { DEFAULT_DB_HOST, DEFAULT_DB_PORT } from 'Common/constants';
dotenv.config();

const dbType = (process.env.DB_TYPE || 'sqlite') as 'postgres' | 'sqlite';

export const dataSourceOptions: DataSourceOptions = dbType === 'sqlite'
  ? {
      type: 'sqlite',
      database: process.env.DB_DATABASE || 'ricky_mobile_store.sqlite',
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      synchronize: process.env.DB_SYNCHRONIZE !== 'false',
      logging: process.env.DB_LOGGING === 'true',
    }
  : {
      type: 'postgres',
      host: process.env.DB_HOST || DEFAULT_DB_HOST,
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : DEFAULT_DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      synchronize: process.env.DB_SYNCHRONIZE !== 'false',
      logging: process.env.DB_LOGGING === 'true',
    };

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
