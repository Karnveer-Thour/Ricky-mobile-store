// create-wishlist.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID, ArrayNotEmpty, IsArray } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';
import { Product } from 'Modules/Product/Entities/Product.entity';
import { User } from 'Modules/User/Entities/User.entity';

export class WishlistDto extends BaseDto {

  @ApiProperty({
        description: 'Enter the name of wishlist',
        example: 'aesthetic products',
        type: 'string',
        required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
      description: 'Enter the Product Ids',
      example: '["5551565","6565656"]',
      type: 'string',
      required: false,
  })
  @IsArray()
  @IsUUID('all', { each: true })
  @IsOptional()
  productIds: Product[];

  @ApiProperty({
      description: 'Enter the Id of User',
      example: '9556866465',
      type: 'string',
      required: false,
  })
  @IsUUID()
  wisherId: User;
}
