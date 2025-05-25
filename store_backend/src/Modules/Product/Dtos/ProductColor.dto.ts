import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BaseDto } from "Common/Dto/base.dto";
import { Product } from "../Entities/Product.entity";
import { ApiProperty } from "@nestjs/swagger";

export class ProductColorDto extends BaseDto{
      @ApiProperty({name:"name",description:"eg. red",nullable:false})  
      @IsString()
      name: string;
    
      @ApiProperty({name:"quantity",description:"eg. 80",nullable:false})
      @IsNumber()
      quantity: Number;
    
      @IsNotEmpty()
      product:Product;
}