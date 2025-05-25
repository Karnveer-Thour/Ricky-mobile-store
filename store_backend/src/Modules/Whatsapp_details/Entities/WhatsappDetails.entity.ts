import { BaseEntity } from 'Common/Entities/Base.entity';
import { Column, Entity, Index } from 'typeorm';

@Entity()
@Index(['name', 'url'])
export class whatsappDetailsEntity extends BaseEntity<whatsappDetailsEntity> {
  @Column({
    name: 'groupName',
    type: 'varchar',
    length: '255',
    nullable: false,
  })
  name: string;

  @Column({
    name: 'groupUrl',
    type: 'varchar',
    nullable: false,
  })
  url: string;
}
