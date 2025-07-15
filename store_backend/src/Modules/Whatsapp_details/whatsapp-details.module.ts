import { Module } from '@nestjs/common';
import { whatsappDetailsRepository } from './Repositories/WhatsappDetails.repo';

@Module({
    providers:[whatsappDetailsRepository],
})
export class WhatsappDetailsModule {}
