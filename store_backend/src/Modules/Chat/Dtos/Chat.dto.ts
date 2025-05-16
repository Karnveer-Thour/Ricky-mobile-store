import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';
import { userType } from '../Entities/Chat.entity';
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

  @IsString()
  @IsNotEmpty()
  senderType: userType;

  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  receiverType: userType;
}
