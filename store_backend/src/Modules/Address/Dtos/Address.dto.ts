import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BaseDto } from "Common/Dto/Base.dto";

export class AdminDto extends BaseDto {
      @IsString()
      @IsOptional()
      houseNumber:string;
  
      @IsString()
      @IsOptional()
      streetNumber:string;
  
      @IsString()
      @IsOptional()
      areaName:string;
  
      @IsString()
      @IsOptional()
      city:string;
  
      @IsNumber()
      @IsOptional()
      pincode:number;
  
      @IsString()
      @IsOptional()
      district:string;
  
      @IsString()
      @IsNotEmpty()
      state:string;
}