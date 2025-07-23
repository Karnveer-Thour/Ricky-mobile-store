import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from './Repositories/Category.repo';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { CategoryDto } from './Dtos/Category.dto';
import { UpdateCategoryDto } from './Dtos/update-category.dto';
import { plainToInstance } from 'class-transformer';
import { TransformCategoryDto } from './Dtos/response-category.dto';
import { ILike } from 'typeorm';
import { dateToUTC } from 'Common/Utils/Utils';

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

  async update(id: string, updateCategory: UpdateCategoryDto): Promise<baseResponseDto> {
    try {
      const existingCategory = await this.categoryRepository.findOneBy({
        id,
      });
      if (!existingCategory) {
        throw new NotFoundException('Category does not exist');
      }
      for (let key in updateCategory) {
        existingCategory[key] = updateCategory[key]??existingCategory[key];
      }
      await this.categoryRepository.save(existingCategory);
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

  async getAll(
    page: number = 1,
    limit: number = 10,
    searchText: string = null,
  ): Promise<baseResponseDto> {
    try {
      const queryBuilder = this.categoryRepository
        .createQueryBuilder('category')
        .where('category.deletedAt IS NULL'); // Exclude soft-deleted records

      // Apply search filter
      if (searchText) {
        queryBuilder.andWhere(
          '(category.name ILIKE :searchText OR category.description ILIKE :searchText)',
          { searchText: `%${searchText}%` },
        );
      }

      // Get total count first (without pagination)
      const total = await queryBuilder.getCount();

      // Apply pagination and ordering
      const categories = await queryBuilder
        .skip((page - 1) * limit)
        .take(limit)
        .orderBy('category.createdAt', 'DESC')
        .getMany();

      // Transform result
      const transformedCategories = categories.map((category) =>
        plainToInstance(TransformCategoryDto, category, { excludeExtraneousValues: true }),
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
      throw new InternalServerErrorException('Error fetching categories');
    }
  }

  async softDeleteById(id: string): Promise<baseResponseDto> {
    try {
      const existedCategory = await this.categoryRepository.findOneBy({ id });
      if (!existedCategory) {
        throw new NotFoundException('Category does not exist');
      }
      await this.categoryRepository.softDelete(id);
      return {
        status: true,
        code: 200,
        data: { message: 'Category deleted successfully' },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to delete category');
    }
  }
}
