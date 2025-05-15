import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { BaseDto } from "Common/Dto/Base.dto";

export class AddressDto extends BaseDto {
    @IsString()
    @IsOptional()
    @MaxLength(15,{ message: 'House number must be at most 15 characters long' })
    houseNumber: string;

    @IsString()
    @IsOptional()
    @MaxLength(25,{ message: 'Street number must be at most 25 characters long' })
    streetNumber: string;

    @IsString()
    @IsOptional()
    @MaxLength(150,{ message: 'Area name must be at most 150 characters long' })
    areaName: string;

    @IsString()
    @IsOptional()
    @MaxLength(30,{ message: 'City name must be at most 30 characters long' })
    city: string;

    @IsNumber()
    @IsOptional()
    pincode: number;

    @IsString()
    @IsOptional()
    @MaxLength(30,{ message: 'District name must be at most 30 characters long' })
    district: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20,{ message: 'State name must be at most 20 characters long' })
    state: string;
}
