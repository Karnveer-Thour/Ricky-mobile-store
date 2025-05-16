import { Module } from '@nestjs/common';
import { ChatRepository } from './Repositories/Chat.repo';

@Module({
    providers:[ChatRepository]
})
export class ChatModule {}
