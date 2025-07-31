import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductReviewService } from './product-review.service';
import { CreateProductReview } from './Dtos/create-product-review.dto';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProductReview } from './Dtos/update-product-review.dto';
import { ProductReviewPaginationQueryDto } from './Dtos/product-review-pagination-query.dto';

@ApiTags('product-review')
@Controller('product-review')
export class ProductReviewController {
  constructor(private readonly productReviewService: ProductReviewService) {}

  @Post()
  async create(@Body() productReviewData: CreateProductReview): Promise<baseResponseDto> {
    return this.productReviewService.create(productReviewData);
  }

  @Patch('id')
  async update(
    @Param('id') id: string,
    @Body() productReviewData: UpdateProductReview,
  ): Promise<baseResponseDto> {
    return this.productReviewService.update(id, productReviewData);
  }

  @Get()
  async getAll(@Query() query: ProductReviewPaginationQueryDto): Promise<baseResponseDto> {
    const pageNumber = parseInt(query.page);
    const limitNumber = parseInt(query.limit);
    return this.productReviewService.getAll(pageNumber, limitNumber);
  }

  @Delete('id')
  async softDeleteById(@Param('id') id: string): Promise<baseResponseDto> {
    return this.productReviewService.softDeleteById(id);
  }
}
