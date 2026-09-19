import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { Readable } from 'stream';
import * as fs from 'fs';
import * as path from 'path';

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

      let uploadResult: any = null;
      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;
      const isCloudinaryConfigured =
        cloudName &&
        cloudName !== 'ricky_mobile_store' &&
        cloudName !== 'your_cloudinary_cloud_name' &&
        apiKey &&
        apiKey !== '123456789012345' &&
        apiSecret &&
        apiSecret !== 'ricky_mobile_store_cloudinary_secret';

      if (isCloudinaryConfigured) {
        try {
          uploadResult = (await this.uploadImageToCloudinary(file, folder)) as UploadApiResponse;
        } catch (cloudErr) {
          console.warn('Cloudinary upload failed, falling back to local file storage:', cloudErr);
        }
      }

      if (uploadResult && (uploadResult.secure_url || uploadResult.url)) {
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
      }

      // Local storage fallback
      const targetDir = path.resolve(process.cwd(), 'uploads', folder);
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const ext = path.extname(file.originalname) || '.jpg';
      const cleanOriginal = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
      const uniqueFilename = `${cleanOriginal}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(targetDir, uniqueFilename);

      fs.writeFileSync(filePath, file.buffer);

      const serverPort = process.env.PORT || 8001;
      const fileUrl = `http://localhost:${serverPort}/uploads/${folder}/${uniqueFilename}`;

      return {
        code: 201,
        status: true,
        data: {
          url: fileUrl,
          public_id: `${folder}/${uniqueFilename}`,
          format: ext.replace('.', ''),
          bytes: file.size,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      console.error('Upload error:', error);
      throw new InternalServerErrorException('Failed to upload image');
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
