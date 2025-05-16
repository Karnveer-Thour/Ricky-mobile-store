import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';

export class AcceptedCitiesDto extends BaseDto {

  @ApiProperty({description:"Enter your City name",example:"Chandigarh",type:'string',required:false})
  @IsString()
  @IsOptional()
  @MaxLength(30, { message: 'City name must be at most 30 characters long' })
  cityName: string;

  @ApiProperty({description:"Enter your City pincode number",example:160001,type:'number',required:false})
  @IsNumber()
  @IsOptional()
  cityPincode: number;

  @ApiProperty({description:"Enter your District name",example:"Chandigarh",type:'string',required:false})
  @IsString()
  @IsOptional()
  @MaxLength(30, { message: 'District must be at most 30 characters long' })
  district: string;

  @ApiProperty({description:"Enter your State name",example:"Punjab",type:'string',required:true})
  @IsString()
  @IsNotEmpty()
  @MaxLength(20, { message: 'State must be at most 20 characters long' })
  state: string;
}
