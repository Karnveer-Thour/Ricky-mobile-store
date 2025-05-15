import { IsString } from "class-validator";
import { BaseEntity } from "Common/Entities/Base.entity";
import { Category } from "Modules/Category/Entities/Category.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";

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
    @IsString()
    name: string;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: "categoryId" })
    category:Category;

    @Column({ name: "price", type: "varchar", length: "20", nullable: false })
    @IsString()
    price: string;

    @Column({
        name: "discount",
        type: "varchar",
        length: "20",
        nullable: true,
        default: "0",
    })
    @IsString()
    discount: string;

    @Column({
        name: "description",
        type: "varchar",
        length: "1500",
        nullable: true,
    })
    @IsString()
    description: string;

    @Column({
        name: "specifications",
        type: "varchar",
        length: "1500",
        nullable: true,
    })
    @IsString()
    specifications: string;

    @Column({
        name: "warranty",
        type: "varchar",
        length: "100",
        nullable: true,
    })
    @IsString()
    warranty: string;
}
