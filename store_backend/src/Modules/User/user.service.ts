import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from './Repositories/User.repo';
import { UserDto } from './Dtos/User.dto';
import { AddressDto } from 'Modules/Address/Dtos/Address.dto';
import { User } from './Entities/User.entity';
import { role } from './Model/Role.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private userRepository:UserRepository){}

    async registerUser(user:UserDto, address:AddressDto): Promise<string | UserDto> {
        try{
            if(user.mobileNumber){
                const existedUser=await this.userRepository.find({where:{mobileNumber:user.mobileNumber}});
                if(existedUser.length!==0){
                    return "User already exists";
                }
            }
            const existedUser=await this.userRepository.find({where:{email:user.email}});
            if(existedUser.length!==0){
                return "User already exists";
            }
            user.password=await bcrypt.hash(user.password+process.env.PASSWORD_PEPPER,10);
           return await this.userRepository.save({...user,address});
        }catch(err){
            throw new Error(err);
        }
    }

    async getCustomers():Promise<User[]>{
        try {
            return await this.userRepository.find({where:{role:role.Customer}});
        } catch (error) {
         throw  new Error(error);   
        }
    }

    async getById(id:string):Promise<User>{
        try {
            return await this.userRepository.findOne({where:{id:id}});
        } catch (error) {
         throw  new Error(error);   
        }
    }
}
