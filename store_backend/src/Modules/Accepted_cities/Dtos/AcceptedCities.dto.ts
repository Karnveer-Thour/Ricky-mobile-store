import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { BaseDto } from "Common/Dto/Base.dto";

export class AcceptedCitiesDto extends BaseDto {
    @IsString()
    @IsOptional()
    cityName: string;

    @IsNumber()
    @IsOptional()
    cityPincode: number;

    @IsString()
    @IsOptional()
    district: string;

    @IsString()
    @IsNotEmpty()
    state: string;
}
