import {
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { dateToUTC } from '../Utils/Utils';

export abstract class BaseEntity<T> {
  @PrimaryGeneratedColumn('uuid') id: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt?: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt?: Date | string;

  @DeleteDateColumn({ name: 'deleted_at', select: false })
  deletedAt?: Date;

  @BeforeInsert()
  createdAtUpdate() {
    this.createdAt = dateToUTC();
  }

  @BeforeInsert()
  @BeforeUpdate()
  updatedAtUpdate() {
    if (this?.updatedAt) {
      this.updatedAt = dateToUTC();
    }
  }

  @BeforeUpdate()
  updatedAtDelete() {
    if (this?.deletedAt) {
      this.deletedAt = dateToUTC();
    }
  }

  constructor(entity: Partial<BaseEntity<T>>) {
    const { createdAt, deletedAt, id, updatedAt } = entity ?? {};
    Object.assign(this, { createdAt, deletedAt, id, updatedAt });
  }
}
