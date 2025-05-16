import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsNotEmpty } from 'class-validator';
import { BaseDto } from 'Common/Dto/Base.dto';

export class ChatDto extends BaseDto {
  @ApiProperty({description:"Enter your message",example:"Hi, Whats up!",type:'string',required:false})
  @IsString()
  @IsOptional()
  message?: string;

  @ApiProperty({description:"Enter your File url that stored in cloud",example:"993.jpg",type:'string',required:false})
  @IsString()
  @IsOptional()
  fileUrl?: string;

  @ApiProperty({description:"Enter Sender Id",example:"654564545",type:'string',required:true})
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  @ApiProperty({description:"Enter Reciever Id",example:"5645467876",type:'string',required:true})
  @IsUUID()
  @IsNotEmpty()
  receiverId: string;
}
