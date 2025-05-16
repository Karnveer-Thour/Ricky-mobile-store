import { BaseRepository } from 'Common/Repositories/Base.repo';
import { Chat } from '../Entities/Chat.entity';
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class ChatRepository extends BaseRepository<Chat> {
  constructor(private readonly dataSource: DataSource) {
    super(Chat, dataSource);
  }
}
