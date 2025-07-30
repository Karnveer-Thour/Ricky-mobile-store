import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ProductService } from './product.service';
import { CreateProductDto } from './Dtos/create-product.dto';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { UpdateProductDto } from './Dtos/update-product.dto';
import { ProductPaginationQueryDto } from './Dtos/product-pagination-query.dto';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('/create')
  async create(@Body() productData: CreateProductDto): Promise<baseResponseDto> {
    return this.productService.create(productData);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() productData: UpdateProductDto,
  ): Promise<baseResponseDto> {
    return this.productService.update(id, productData);
  }

  @Get()
  async getAll(@Query() query: ProductPaginationQueryDto): Promise<baseResponseDto> {
    const pageNumber = parseInt(query.page);
    const limitNumber = parseInt(query.limit);
    return this.productService.getAllWithPagination(pageNumber, limitNumber, query.searchText);
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<baseResponseDto> {
    return this.productService.getById(id);
  }

  @Delete(':id')
  async softDeleteById(@Param('id') id: string): Promise<baseResponseDto> {
    return this.productService.softDeleteById(id);
  }

  @Get('download-csv')
  async downloadCSV(): Promise<void> {
    return this.productService.downloadCSV();
  }

  @Post('upload-csv')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadCSV(@UploadedFile() file: Express.Multer.File) {
    return this.productService.uploadCSV(file.path);
  }
}
