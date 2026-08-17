import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { ENV_CONFIG } from 'Common/constants';
dotenv.config();

const dbConfig = ENV_CONFIG.DATABASE;

export const dataSourceOptions: DataSourceOptions = dbConfig.TYPE === 'sqlite'
  ? {
      type: 'sqlite',
      database: dbConfig.DATABASE,
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      synchronize: dbConfig.SYNCHRONIZE,
      logging: dbConfig.LOGGING,
    }
  : {
      type: 'postgres',
      host: dbConfig.HOST,
      port: dbConfig.PORT,
      username: dbConfig.USERNAME,
      password: dbConfig.PASSWORD,
      database: dbConfig.DATABASE,
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      synchronize: dbConfig.SYNCHRONIZE,
      logging: dbConfig.LOGGING,
    };

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
