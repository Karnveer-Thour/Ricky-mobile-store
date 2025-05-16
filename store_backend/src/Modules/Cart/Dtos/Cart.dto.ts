import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsUUID, ValidateNested } from 'class-validator';

export class CartDto {

  @ApiProperty({description:"Enter Product Ids",example:"[33,764,...,177]",type:'array',isArray:true,required:false})
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  productIds: string[];

  @ApiProperty({description:"Enter User Id",example:"4452564564",type:'string',required:true})
  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
