import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'Common/Entities/Base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Product } from './Product.entity';

@Entity()
@Index(['product', 'name', 'quantity'])
export class ProductColor extends BaseEntity<ProductColor> {
  @JoinColumn({ name: 'ProductId' })
  @ManyToOne(() => Product, (product) => product.colors)
  product: Product;

  @Column({
    name: 'colorName',
    type: 'varchar',
    length: '254',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'quantity',
    type: 'numeric',
    nullable: false,
  })
  quantity: Number;
}
