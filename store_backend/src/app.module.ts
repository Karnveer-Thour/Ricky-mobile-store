import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'Database/typeORM.config';
import { AddressModule } from './Modules/Address/address.module';
import { ProductModule } from './Modules/Product/product.module';
import { CategoryModule } from './Modules/Category/category.module';
import { DeliveryAddressModule } from './Modules/Delivery_address/delivery-address.module';
import { ProductReviewModule } from './Modules/Product_review/product-review.module';
import { ChatModule } from './Modules/Chat/chat.module';
import { UserModule } from 'Modules/User/User.module';
import { CartModule } from './Modules/Cart/cart.module';
import { WishlistModule } from './Modules/Wishlist/wishlist.module';
import { PaymentModule } from 'Modules/Payment/payment.module';
import { WhatsappDetailsModule } from './Modules/Whatsapp_details/whatsapp-details.module';
import { FirebaseService } from 'Core/Firebase/firebase.service';
import { AcceptedCitiesModule } from 'Modules/Accepted_cities/accepted-cities.module';
import { SaleModule } from './Modules/Sale/sale.module';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from 'Core/Guards/firebase-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available app-wide
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    AddressModule,
    AcceptedCitiesModule,
    ProductModule,
    CategoryModule,
    DeliveryAddressModule,
    ProductReviewModule,
    SaleModule,
    ChatModule,
    CartModule,
    WishlistModule,
    PaymentModule,
    WhatsappDetailsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    FirebaseService,
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
  ],
  exports: [FirebaseService],
})
export class AppModule {}
