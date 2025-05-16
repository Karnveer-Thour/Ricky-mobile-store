import { BaseRepository } from 'Common/Repositories/Base.repo';
import { Category } from '../Entities/Category.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryRepository extends BaseRepository<Category> {
  constructor(private readonly dataSource: DataSource) {
    super(Category, dataSource);
  }
}
