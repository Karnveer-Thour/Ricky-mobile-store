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
import { ProductColor } from './ProductColor.entity';
import { IsOptional } from 'class-validator';

@Entity()
@Index(['price'])
export class Product extends BaseEntity<Product> {
  @Column({ name: 'name', type: 'varchar', length: '150', nullable: false, unique: true })
  name: string;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ name: 'price', type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({
    name: 'discount',
    type: 'decimal',
    precision: 10,
    scale: 2,
    nullable: true,
    default: 0,
  })
  discount: number;

  @Column({
    name: 'description',
    type: 'varchar',
    length: '1500',
    nullable: true,
  })
  description: string;

  @Column({
    name: 'quantity',
    type: 'numeric',
    nullable: true,
  })
  @IsOptional()
  quantity: number;

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
  @OneToMany(() => ProductReview, (reviews) => reviews.reviewedProduct, {
    cascade: ['soft-remove'],
  })
  reviews: ProductReview[];

  @OneToMany(() => ProductColor, (colors) => colors.product, {
    cascade: ['soft-remove', 'update', 'insert'],
    eager: true,
  })
  colors: ProductColor[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.products)
  wishlists: Wishlist[];
}
