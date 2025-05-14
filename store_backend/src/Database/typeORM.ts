import { DataSource } from "typeorm";

export const newDatasource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: ["../Entities/*{.ts,.js}"],
    synchronize: process.env.DB_SYNCHRONIZE === "true",
    logging: process.env.DB_LOGGING === "true",
});

export const databaseConnect = async () => {
    try {
        newDatasource.initialize();
        console.log("Databse connected successfully");
    } catch (error) {
        console.log(error);
    }
};
