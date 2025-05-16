import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';

export class AddressDto extends BaseDto {
  
  @ApiProperty({description:"Enter your house number",example:"L-34",type:'string',required:false})
  @IsString()
  @IsOptional()
  @MaxLength(15, {
    message: 'House number must be at most 15 characters long',
  })
  houseNumber: string;

  @ApiProperty({description:"Enter your Street number",example:"3R",type:'string',required:false})
  @IsString()
  @IsOptional()
  @MaxLength(25, {
    message: 'Street number must be at most 25 characters long',
  })
  streetNumber: string;

  @ApiProperty({description:"Enter your Area name",example:"Gulmohar Nagar",type:'string',required:false})
  @IsString()
  @IsOptional()
  @MaxLength(150, {
    message: 'Area name must be at most 150 characters long',
  })
  areaName: string;

  @ApiProperty({description:"Enter your City name",example:"Chandigarh",type:'string',required:false})
  @IsString()
  @IsOptional()
  @MaxLength(30, { message: 'City name must be at most 30 characters long' })
  city: string;

  @ApiProperty({description:"Enter your City pincode",example:"16001",type:'number',required:false})
  @IsNumber()
  @IsOptional()
  pincode: number;

  @ApiProperty({description:"Enter your District name",example:"Chandigarh",type:'string',required:false})
  @IsString()
  @IsOptional()
  @MaxLength(30, {
    message: 'District name must be at most 30 characters long',
  })
  district: string;

  @ApiProperty({description:"Enter your State name",example:"Punjab",type:'string',required:true})
  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'State name must be at most 20 characters long' })
  state: string;
}
