import { Module } from '@nestjs/common';
import { CustomerRepository } from './Repositories/Customer.repo';

@Module({
    providers:[CustomerRepository]
})
export class CustomerModule {}
