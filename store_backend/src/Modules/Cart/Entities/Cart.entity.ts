import { BaseEntity } from 'Common/Entities/Base.entity';
import { Product } from 'Modules/Product/Entities/Product.entity';
import { User } from 'Modules/User/Entities/User.entity';
import { Entity, Index, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';

@Entity()
@Index(['cartOwner'])
export class Cart extends BaseEntity<Cart> {
  @ManyToMany(() => Product, (items) => items.carts, {
    eager: true,
    cascade: true,
  })
  @JoinTable({ name: 'cartItems' })
  items: Product[];

  @OneToOne(() => User, (cartOwner) => cartOwner.cart)
  @JoinColumn({ name: 'cartOwner' })
  cartOwner: User;
}
