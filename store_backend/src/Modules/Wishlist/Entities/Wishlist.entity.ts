import { BaseEntity } from 'Common/Entities/Base.entity';
import { Product } from 'Modules/Product/Entities/Product.entity';
import { User } from 'Modules/User/Entities/User.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
@Index(['name', 'wisher'])
export class Wishlist extends BaseEntity<Wishlist> {
  @Column({
    name: 'name',
    type: 'varchar',
    length: '55',
    nullable: true,
    default: 'Mysterious wishlist',
  })
  name: string;

  @OneToMany(() => Product, (product) => product.wishlist, { eager: true })
  products: Product[];

  @ManyToOne(() => User, (wisher) => wisher.wishlists, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'wisher' })
  wisher: User;
}
