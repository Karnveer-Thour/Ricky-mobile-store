import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "Database/typeORM.config";
import { AdminModule } from './Modules/Admin/admin.module';
import { CustomerModule } from './Modules/Customer/customer.module';
import { AddressModule } from './Modules/Address/address.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Makes config available app-wide
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot(dataSourceOptions),
        AdminModule,
        CustomerModule,
        AddressModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
