import { DataSource } from 'typeorm';

export const newDatasource = new DataSource({
  type: 'postgres',
  host: process.env.HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  entities:["src/entities/*{.ts,.js}"],
  synchronize: process.env.SYNCHRONIZE === 'true',
  logging:process.env.LOGGING === 'true',
});

export const databaseConnect = async () => {
  try {
    newDatasource.initialize();
    console.log('Databse connected successfully');
  } catch (error) {
    console.log(error);
  }
};