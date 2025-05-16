import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';

export class ChatDto extends BaseDto {
  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  fileUrl?: string;

  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  @IsUUID()
  @IsNotEmpty()
  receiverId: string;
}
