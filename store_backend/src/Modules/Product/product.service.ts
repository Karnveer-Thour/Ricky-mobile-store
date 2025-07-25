import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ProductRepository } from './Repositories/Product.repo';
import { ProductColorRepository } from './Repositories/ProductColor.repo';
import { ProductDto } from './Dtos/Product.Dto';
import { ProductColorDto } from './Dtos/ProductColor.dto';
import { CreateProductDto } from './Dtos/create-product.dto';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';

@Injectable()
export class ProductService {
    constructor(
        private readonly productRepository:ProductRepository,
        private readonly productColorRepository:ProductColorRepository,
    ){}

    async create(productData:CreateProductDto):Promise<baseResponseDto>{
        try {
            const existingProduct=await this.productRepository.findOneBy({name:productData.name,description:productData.description});
            
            if(existingProduct){
                throw new ConflictException("Product already existed");
            }
            

            return
        } catch (error) {
            throw new InternalServerErrorException("Unable to create a new product");
        }
    }

}
