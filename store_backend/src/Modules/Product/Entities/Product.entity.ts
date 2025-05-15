import { BaseEntity } from "Common/Entities/Base.entity";
import { Category } from "Modules/Category/Entities/Category.entity";
import { ProductReview } from "Modules/Product_review/Entitities/ProductReview.entity";
import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
} from "typeorm";

@Entity()
@Index([
    "name",
    "category",
    "price",
    "discount",
    "description",
    "specifications",
    "warranty",
])
export class Product extends BaseEntity<Product> {
    @Column({ name: "name", type: "varchar", length: "50", nullable: false })
    name: string;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: "categoryId" })
    category: Category;

    @Column({ name: "price", type: "varchar", length: "20", nullable: false })
    price: string;

    @Column({
        name: "discount",
        type: "varchar",
        length: "20",
        nullable: true,
        default: "0",
    })
    discount: string;

    @Column({
        name: "description",
        type: "varchar",
        length: "1500",
        nullable: true,
    })
    description: string;

    @Column({
        name: "specifications",
        type: "varchar",
        length: "1500",
        nullable: true,
    })
    specifications: string;

    @Column({
        name: "warranty",
        type: "varchar",
        length: "100",
        nullable: true,
    })
    warranty: string;

    //Inverse relations
    @OneToMany(() => ProductReview, (reviews) => reviews.reviewedProduct)
    reviews: ProductReview[];
}
