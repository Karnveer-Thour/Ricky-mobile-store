import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity } from 'Common/Entities/Base.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { Product } from './Product.entity';

@Entity()
@Index(['product', 'ram', 'storage', 'color'])
export class ProductVariant extends BaseEntity<ProductVariant> {
  @JoinColumn({ name: 'ProductId' })
  @ManyToOne(() => Product, (product) => product.variants)
  product: Product;

  @Column({
    name: 'ram',
    type: 'varchar',
    length: '100',
    nullable: true,
  })
  ram: string;

  @Column({
    name: 'storage',
    type: 'varchar',
    length: '100',
    nullable: true,
  })
  storage: string;

  @Column({
    name: 'color',
    type: 'varchar',
    length: '254',
    nullable: true,
  })
  color: string;

  @Column({
    name: 'quantity',
    type: 'numeric',
    nullable: false,
    default: 0,
  })
  quantity: number;
}
