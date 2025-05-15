import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { BaseDto } from "Common/Dto/Base.dto";

export class AcceptedCitiesDto extends BaseDto {
    @IsString()
    @IsOptional()
    @MaxLength(30,{ message: 'City name must be at most 30 characters long' })
    cityName: string;

    @IsNumber()
    @IsOptional()
    cityPincode: number;

    @IsString()
    @IsOptional()
    @MaxLength(30,{ message: 'District must be at most 30 characters long' })
    district: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20,{ message: 'State must be at most 20 characters long' })
    state: string;
}
