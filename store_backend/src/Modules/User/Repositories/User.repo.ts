import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'Common/Repositories/Base.repo';
import { DataSource } from 'typeorm';
import { User } from '../Entities/User.entity';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource);
  }
}
