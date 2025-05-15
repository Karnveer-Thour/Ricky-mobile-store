import { Module } from "@nestjs/common";
import { CategoryRepository } from "./Repositories/Category.repo";

@Module({
    providers: [CategoryRepository],
})
export class CategoryModule {}
