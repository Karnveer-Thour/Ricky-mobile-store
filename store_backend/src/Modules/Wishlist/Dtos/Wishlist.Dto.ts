// create-wishlist.dto.ts
import { IsOptional, IsString, IsUUID, ArrayNotEmpty, IsArray } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';
import { Product } from 'Modules/Product/Entities/Product.entity';
import { User } from 'Modules/User/Entities/User.entity';

export class WishlistDto extends BaseDto{
  @IsOptional()
  @IsString()
  name?: string;

  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()  
  productIds: Product[];

  @IsUUID()
  wisherId: User;
}
