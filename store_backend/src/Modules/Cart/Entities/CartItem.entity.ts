import { BaseEntity } from 'Common/Entities/Base.entity';
import { Product } from 'Modules/Product/Entities/Product.entity';
import { ProductColor } from 'Modules/Product/Entities/ProductColor.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Cart } from './Cart.entity';

@Entity()
export class CartItem extends BaseEntity<CartItem> {
  @ManyToOne(() => Cart, (cart) => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => Product, { eager: true, onDelete: 'CASCADE' })
  product: Product;

  @Column({ name: 'quantity', type: 'integer', default: 1 })
  quantity: number;

  @ManyToOne(() => ProductColor, { nullable: true, eager: true, onDelete: 'SET NULL' })
  selectedColor: ProductColor;
}
