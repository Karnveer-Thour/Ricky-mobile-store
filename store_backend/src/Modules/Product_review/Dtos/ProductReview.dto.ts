import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { BaseDto } from "Common/Dto/Base.dto";

export class ProductReview extends BaseDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(55)
    title: string;

    @IsString()
    @IsOptional()
    @MaxLength(550)
    description: string;
}
