import { IsString } from 'class-validator';
import { BaseEntity } from 'Common/Entities/Base.entity';
import { Product } from 'Modules/Product/Entities/Product.entity';
import { Column, Entity, Index, JoinColumn, OneToMany } from 'typeorm';

@Entity()
@Index(['name', 'description'])
export class Category extends BaseEntity<Category> {
  @Column({ name: 'name', type: 'varchar', length: '100', nullable: false,unique:true })
  name: string;

  @Column({
    name: 'description',
    type: 'varchar',
    length: '550',
    nullable: false,
  })
  description: string;

  @OneToMany(() => Product, (Product) => Product.category)
  products: Product[];
}
