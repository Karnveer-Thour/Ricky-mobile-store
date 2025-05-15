import { Module } from "@nestjs/common";
import { ProductRepository } from "./Repositories/Product.repo";

@Module({
    providers: [ProductRepository],
})
export class ProductModule {}
