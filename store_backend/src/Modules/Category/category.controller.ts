import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from '@nestjs/swagger';
import { CategoryDto } from './Dtos/Category.dto';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { UpdateCategoryDto } from './Dtos/update-category.dto';

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

  @Get(':page/:limit/:searchText')
  async getAll(
    @Param('page') page?: string,
    @Param('limit') limit?: string,
    @Param('searchText') searchText?: string,
  ): Promise<baseResponseDto> {
    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 10;
    return this.categoryService.getAll(pageNumber, limitNumber, searchText);
  }

  @Delete(':id')
  async softDeleteById(@Param('id') id: string): Promise<baseResponseDto> {
    return this.categoryService.softDeleteById(id);
  }
}
