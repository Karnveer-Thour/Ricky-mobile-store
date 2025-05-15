import { BaseEntity } from "Common/Entities/Base.entity";
import { Customer } from "Modules/Customer/Entities/Customer.entity";
import { Product } from "Modules/Product/Entities/Product.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

@Entity()
@Index(["title", "description", "reviewedBy", "reviewedProduct"])
export class ProductReview extends BaseEntity<ProductReview> {
    @Column({ name: "title", type: "varchar", length: "55", nullable: false })
    title: string;

    @Column({
        name: "description",
        type: "varchar",
        length: "550",
        nullable: true,
    })
    description: string;

    @ManyToOne(() => Customer, (customer) => customer.reviews, { eager: true })
    @JoinColumn({ name: "reviewedBy" })
    reviewedBy: Customer;

    @ManyToOne(() => Product, (product) => product.reviews, { eager: true })
    @JoinColumn({ name: "reviewedProduct" })
    reviewedProduct: Product;
}
