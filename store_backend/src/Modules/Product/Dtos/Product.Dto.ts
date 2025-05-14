import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { BaseDto } from "Common/Dto/Base.dto";

export class ProductDto extends BaseDto{
        @IsString()
        @IsNotEmpty()
        name: string;
    
        @IsString()
        @IsNotEmpty()
        price: string;
    
        @IsString()
        @IsOptional()
        discount: string;
    
        @IsString()
        @IsOptional()
        description: string;
        
        @IsString()
        @IsOptional()
        specifications: string;
    
        @IsString()
        @IsOptional()
        warranty: string;
}