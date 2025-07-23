import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './Dtos/Category.dto';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { UpdateCategoryDto } from './Dtos/update-category.dto';
import { CategoryPaginationQueryDto } from './Dtos/category-pagination-query.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('create')
  async create(@Body() categoryData: CategoryDto): Promise<baseResponseDto> {
    return this.categoryService.create(categoryData);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() categoryData: UpdateCategoryDto,
  ): Promise<baseResponseDto> {
    return this.categoryService.update(id, categoryData);
  }

  @Get()
  async getAll(@Query() query: CategoryPaginationQueryDto): Promise<baseResponseDto> {
    const pageNumber = parseInt(query.page, 10) || 1;
    const limitNumber = parseInt(query.limit, 10) || 10;
    const searchText = query.searchText || null;
    return this.categoryService.getAll(pageNumber, limitNumber, searchText);
  }

  @Delete(':id')
  async softDeleteById(@Param('id') id: string): Promise<baseResponseDto> {
    return this.categoryService.softDeleteById(id);
  }
}
