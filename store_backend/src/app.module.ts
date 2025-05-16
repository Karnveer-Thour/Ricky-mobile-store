import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { dataSourceOptions } from "Database/typeORM.config";
import { AdminModule } from "./Modules/Admin/admin.module";
import { CustomerModule } from "./Modules/Customer/customer.module";
import { AddressModule } from "./Modules/Address/address.module";
import { AcceptedCitiesModule } from "./Modules/Accepted_cities/accepted-cities.module";
import { ProductModule } from "./Modules/Product/product.module";
import { CategoryModule } from "./Modules/Category/category.module";
import { DeliveryAddressModule } from "./Modules/Delivery_address/delivery-address.module";
import { ProductReviewModule } from "./Modules/Product_review/product-review.module";
import { SaleModule } from './Modules/Sale/sale.module';
import { ChatModule } from './Modules/Chat/chat.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true, // Makes config available app-wide
            envFilePath: ".env",
        }),
        TypeOrmModule.forRoot(dataSourceOptions),
        AdminModule,
        CustomerModule,
        AddressModule,
        AcceptedCitiesModule,
        ProductModule,
        CategoryModule,
        DeliveryAddressModule,
        ProductReviewModule,
        SaleModule,
        ChatModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
