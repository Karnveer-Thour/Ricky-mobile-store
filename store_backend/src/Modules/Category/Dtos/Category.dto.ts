import { IsNotEmpty, IsString } from "class-validator";
import { BaseDto } from "Common/Dto/Base.dto";

export class CategoryDto extends BaseDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;
}
