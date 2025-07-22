import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CategoryRepository } from './Repositories/Category.repo';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { CategoryDto } from './Dtos/Category.dto';
import { UpdateCategoryDto } from './Dtos/update-category.dto';
import { plainToInstance } from 'class-transformer';
import { TransformCategoryDto } from './Dtos/response-category.dto';

@Injectable()
export class CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}

  async create(category: CategoryDto): Promise<baseResponseDto> {
    try {
      const existingCategory = await this.categoryRepository.findOneBy({ name: category.name });
      if (existingCategory) {
        throw new ConflictException('Category already existed');
      }
      const newCategory = await this.categoryRepository.save(category);
      return {
        code: 201,
        status: true,
        data: newCategory,
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to create new Category');
    }
  }

  async update(updateCategory: UpdateCategoryDto): Promise<baseResponseDto> {
    try {
      const existingCategory = await this.categoryRepository.findOneBy({
        name: updateCategory.name,
      });
      if (!existingCategory) {
        throw new NotFoundException('Category does not exist');
      }
      await this.categoryRepository.update(existingCategory.id, updateCategory);
      return {
        status: true,
        code: 200,
        data: {
          message: 'Category updated successfully.',
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to update category');
    }
  }

  async getAllCategories(page: number = 1, limit: number = 10): Promise<baseResponseDto> {
    try {
      const [categories, total] = await this.categoryRepository.findAndCount({
        where: { deletedAt: null },
        skip: (page - 1) * limit,
        take: limit,
      });

      const transformedCategories = categories.map((customer) =>
        plainToInstance(TransformCategoryDto, customer, { excludeExtraneousValues: true }),
      );

      return {
        status: true,
        code: 200,
        data: {
          transformedCategories,
          total,
          page,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Error fetching customers');
    }
  }

  async softDeleteCategoryById(id: string): Promise<baseResponseDto> {
    try {
      const existedCategory = await this.categoryRepository.findOneBy({ id });
      if (!existedCategory) {
        throw new NotFoundException('Category does not exist');
      }
      await this.categoryRepository.softDelete(existedCategory.id);
      return {
        status: true,
        code: 200,
        data: { message: 'Category deleted successfully' },
      };
    } catch (error) {
        throw new InternalServerErrorException("Unable to delete category");
    }
  }
}
