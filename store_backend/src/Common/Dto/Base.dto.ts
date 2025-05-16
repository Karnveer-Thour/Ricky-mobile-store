import { ClassConstructor, plainToInstance } from 'class-transformer';

export class BaseDto<T = any> {
  static fromEntity<T, V extends BaseDto>(
    this: ClassConstructor<V> & typeof BaseDto,
    entity: T,
  ): V {
    return plainToInstance(this, entity, {
      excludeExtraneousValues: true,
    });
  }

  static fromEntities<T, V extends BaseDto>(
    this: ClassConstructor<V> & typeof BaseDto,
    entities: T[],
  ): V[] {
    return entities.map((entity) => this.fromEntity(entity));
  }
}
