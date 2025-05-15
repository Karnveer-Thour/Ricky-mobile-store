import { BaseDto } from "Common/Dto/Base.dto";
import { label } from "../Entities/DeliveryAddress.entity";
import { IsBoolean, IsEnum, IsOptional } from "class-validator";

export class DeliveryAddressDto extends BaseDto {
    @IsBoolean()
    @IsOptional()
    isDefault: boolean;

    @IsEnum(label)
    @IsOptional()
    label: label;
}
