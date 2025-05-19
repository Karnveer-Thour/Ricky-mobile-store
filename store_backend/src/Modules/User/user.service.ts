import { Injectable } from '@nestjs/common';
import { UserRepository } from './Repositories/User.repo';
import { UserDto } from './Dtos/User.dto';
import { User } from './Entities/User.entity';
import { AddressDto } from 'Modules/Address/Dtos/Address.dto';
import { AddressRepository } from 'Modules/Address/Repositories/Address.repo';

@Injectable()
export class UserService {
    constructor(private userRepository:UserRepository,private AddressRepository:AddressRepository){}

    async registerUser(User:UserDto,Address:AddressDto){
        try{
            const savedAdress=await this.AddressRepository.save(Address);
            User.Address=savedAdress.id;
           return await  this.userRepository.save(User);
        }catch(err){
            throw new Error(err);
        }
    }
}
