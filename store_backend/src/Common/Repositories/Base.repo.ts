import { DataSource, EntityTarget, Repository } from 'typeorm';

export abstract class BaseRepository<T> extends Repository<T> {
  constructor(target: EntityTarget<T>, dataSource: DataSource) {
    super(target, dataSource.createEntityManager());
  }
}
