import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "Database/typeORM.config";
import { AdminModule } from './Modules/Admin/admin.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Makes config available app-wide
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(dataSourceOptions),
        AdminModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
