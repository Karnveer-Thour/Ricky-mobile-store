import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  async uploadImageToCloudinary(
    file: Express.Multer.File,
    folder: string = 'ricky_mobile_store',
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(uploadStream);
    });
  }

  async uploadSingleFile(
    file: Express.Multer.File,
    folder: string = 'products',
  ): Promise<baseResponseDto> {
    try {
      if (!file) {
        throw new BadRequestException('No file uploaded!');
      }

      // Allowed image mime types
      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Invalid file format. Allowed formats: ${allowedMimeTypes.join(', ')}`,
        );
      }

      // 5MB file size limit
      const maxSizeInBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        throw new BadRequestException('File size exceeds maximum limit of 5MB');
      }

      const uploadResult = (await this.uploadImageToCloudinary(file, folder)) as UploadApiResponse;

      return {
        code: 201,
        status: true,
        data: {
          url: uploadResult.secure_url || uploadResult.url,
          public_id: uploadResult.public_id,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Cloudinary upload error:', error);
      throw new InternalServerErrorException('Failed to upload image to Cloudinary');
    }
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'products',
  ): Promise<baseResponseDto> {
    try {
      if (!files || !files.length) {
        throw new BadRequestException('No files uploaded!');
      }

      const uploadPromises = files.map((file) => this.uploadSingleFile(file, folder));
      const results = await Promise.all(uploadPromises);

      const uploadedFiles = results.map((res) => res.data);

      return {
        code: 201,
        status: true,
        data: {
          files: uploadedFiles,
          count: uploadedFiles.length,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Multiple Cloudinary upload error:', error);
      throw new InternalServerErrorException('Failed to upload images to Cloudinary');
    }
  }
}
