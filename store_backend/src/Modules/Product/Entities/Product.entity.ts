import { BaseEntity } from 'Common/Entities/Base.entity';
import { Cart } from 'Modules/Cart/Entities/Cart.entity';
import { Category } from 'Modules/Category/Entities/Category.entity';
import { ProductReview } from 'Modules/Product_review/Entitities/ProductReview.entity';
import { Sale } from 'Modules/Sale/Entities/Sale.entity';
import { Wishlist } from 'Modules/Wishlist/Entities/Wishlist.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
@Index(['name', 'category', 'price', 'discount', 'description', 'specifications', 'warranty'])
export class Product extends BaseEntity<Product> {
  @Column({ name: 'name', type: 'varchar', length: '150', nullable: false })
  name: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ name: 'price', type: 'varchar', length: '20', nullable: false })
  price: string;

  @Column({
    name: 'discount',
    type: 'varchar',
    length: '20',
    nullable: true,
    default: '0',
  })
  discount: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: '1500',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'specifications',
    type: 'varchar',
    length: '1500',
    nullable: true,
  })
  specifications: string;

  @Column({
    name: 'warranty',
    type: 'varchar',
    length: '100',
    nullable: true,
  })
  warranty: string;

  //Inverse relations
  @OneToMany(() => ProductReview, (reviews) => reviews.reviewedProduct)
  reviews: ProductReview[];

  @ManyToOne(() => Sale, (sold) => sold.products)
  @JoinColumn({ name: 'saleId' })
  sold: Sale;

  @ManyToOne(() => Wishlist, (wishlist) => wishlist.products, {
    onDelete: 'CASCADE',
  })
  wishlist: Wishlist;

  @ManyToMany(() => Cart, (carts) => carts.items, { onDelete: 'CASCADE' })
  carts: Cart[];
}
