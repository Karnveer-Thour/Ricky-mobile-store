import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadService } from './upload.service';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { Public } from 'Common/Decorators/public.decorator';

@ApiTags('Upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Public()
  @Post('image')
  @ApiOperation({ summary: 'Upload single image to Cloudinary using Multer' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ): Promise<baseResponseDto> {
    return await this.uploadService.uploadSingleFile(file, folder || 'ricky_mobile_store');
  }

  @Public()
  @Post('images')
  @ApiOperation({ summary: 'Upload multiple images to Cloudinary using Multer' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadImages(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ): Promise<baseResponseDto> {
    return await this.uploadService.uploadMultipleFiles(files, folder || 'ricky_mobile_store');
  }
}
