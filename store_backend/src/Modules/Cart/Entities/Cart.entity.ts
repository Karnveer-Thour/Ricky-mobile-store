import { BaseEntity } from 'Common/Entities/Base.entity';
import { User } from 'Modules/User/Entities/User.entity';
import { Entity, Index, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { CartItem } from './CartItem.entity';

@Entity()
@Index(['cartOwner'])
export class Cart extends BaseEntity<Cart> {
  @OneToMany(() => CartItem, (items) => items.cart, {
    eager: true,
    cascade: true,
  })
  items: CartItem[];

  @OneToOne(() => User, (cartOwner) => cartOwner.cart)
  @JoinColumn({ name: 'cartOwner' })
  cartOwner: User;
}
