import { BaseRepository } from "Common/Repositories/Base.repo";
import { ProductReview } from "../Entitities/ProductReview.entity";
import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class ProductReviewRepository extends BaseRepository<ProductReview> {
    constructor(private readonly dataSource: DataSource) {
        super(ProductReview, dataSource);
    }
}
