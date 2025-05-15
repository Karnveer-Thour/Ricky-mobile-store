import { Transform } from "class-transformer";
import {
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";
import { BaseDto } from "Common/Dto/base.dto";
import { birthToAge } from "Common/Utils/Utils";

export class AdminDto extends BaseDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNumber()
    @IsOptional()
    mobileNumber: string;

    @IsDateString()
    @IsOptional()
    dateBirth: Date;

    @IsNumber()
    @Transform(({ obj }) => birthToAge(obj.dateBirth), { toClassOnly: true })
    age: number;
}
