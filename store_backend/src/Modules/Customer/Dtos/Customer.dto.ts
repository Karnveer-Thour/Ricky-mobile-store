import { Transform } from "class-transformer";
import {
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
    MinLength,
} from "class-validator";
import { BaseDto } from "Common/Dto/base.dto";
import { birthToAge } from "Common/Utils/Utils";

export class AdminDto extends BaseDto {
    @IsString()
       @IsNotEmpty()
       @MaxLength(25,{ message: 'First name must be at most 25 characters long' })
       firstName: string;
   
       @IsString()
       @IsNotEmpty()
       @MaxLength(25,{ message: 'Last name must be at most 25 characters long' })
       lastName: string;
   
       @IsEmail()
       @IsNotEmpty()
       @MaxLength(254,{ message: 'Email must be at most 254 characters long' })
       email: string;
   
       @IsNotEmpty()
       @MinLength(8, { message: 'Password must be at least 8 characters long' })
       @MaxLength(255,{ message: 'Password must be at most 255 characters long' })
       @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
           message:
             'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
         })
       password: string;
   
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
