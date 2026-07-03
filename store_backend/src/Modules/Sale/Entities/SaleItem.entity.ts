import { BaseEntity } from 'Common/Entities/Base.entity';
import { Product } from 'Modules/Product/Entities/Product.entity';
import { ProductColor } from 'Modules/Product/Entities/ProductColor.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Sale } from './Sale.entity';

@Entity()
export class SaleItem extends BaseEntity<SaleItem> {
  @ManyToOne(() => Sale, (sale) => sale.products, { onDelete: 'CASCADE' })
  sale: Sale;

  @ManyToOne(() => Product, { eager: true, onDelete: 'RESTRICT' })
  product: Product;

  @Column({ name: 'quantity', type: 'integer', default: 1 })
  quantity: number;

  @Column({ name: 'purchasedPrice', type: 'decimal', precision: 10, scale: 2, nullable: false })
  purchasedPrice: number;

  @Column({ name: 'purchasedDiscount', type: 'decimal', precision: 10, scale: 2, default: 0 })
  purchasedDiscount: number;

  @ManyToOne(() => ProductColor, { nullable: true, eager: true, onDelete: 'SET NULL' })
  selectedColor: ProductColor;
}
