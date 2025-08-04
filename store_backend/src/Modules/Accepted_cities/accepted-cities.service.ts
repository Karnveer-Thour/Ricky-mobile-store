import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AcceptedCitiesRepository } from './Repositories/accepted-cities.Repo';
import { AcceptedCitiesDto } from './Dtos/accepted-cities.dto';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { error } from 'console';
import { UpdateAcceptedCitiesDto } from './Dtos/update-accepted-cities.dto';
import { ILike } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { TransformAcceptedCitiesDto } from './Dtos/accepted-cities-response.dto';
import { dateToUTC } from 'Common/Utils/Utils';

@Injectable()
export class AcceptedCitiesService {
  constructor(private readonly acceptedCitiesRepository: AcceptedCitiesRepository) {}

  async create(cityData: AcceptedCitiesDto): Promise<baseResponseDto> {
    try {
      const existingCity = await this.acceptedCitiesRepository.findOneBy({
        cityPincode: cityData.cityPincode,
        cityName: cityData.cityName,
      });
      if (existingCity) {
        throw new ConflictException('City already existed');
      }
      const newCity = await this.acceptedCitiesRepository.save(cityData);
      return {
        code: 201,
        status: true,
        data: newCity,
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to create a new city');
    }
  }

  async update(id: string, cityData: UpdateAcceptedCitiesDto): Promise<baseResponseDto> {
    try {
      const existingCity = await this.acceptedCitiesRepository.findOneBy({ id });
      if (!existingCity) {
        throw new NotFoundException('City does not exist');
      }
      for (let key in cityData) {
        existingCity[key] = cityData[key] ?? existingCity[key];
      }
      await this.acceptedCitiesRepository.save(existingCity);
      return {
        status: true,
        code: 204,
        data: {
          message: 'City updated successfully.',
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to update a city');
    }
  }

  async toggleStatus(id: string, isAccepting: boolean): Promise<baseResponseDto> {
    try {
      const existingCity = await this.acceptedCitiesRepository.findOneBy({ id });
      if (!existingCity) {
        throw new NotFoundException('City does not exist');
      }
      existingCity.isAccepting = isAccepting;
      await this.acceptedCitiesRepository.save(existingCity);
      return {
        status: true,
        code: 204,
        data: {
          message: `city ${isAccepting ? 'activated' : 'deactivated'} successfully`,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to toggle a city');
    }
  }

  async getById(id: string): Promise<baseResponseDto> {
    try {
      const existingCity = await this.acceptedCitiesRepository.findOneBy({ id });
      if (!existingCity) {
        throw new NotFoundException('City does not exist');
      }
      return {
        status: true,
        code: 200,
        data: {
          data: existingCity,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to get a city');
    }
  }

  async getAll(
    page: number = 1,
    limit: number = 10,
    searchText: string = null,
  ): Promise<baseResponseDto> {
    try {
      const queryBuilder = this.acceptedCitiesRepository.createQueryBuilder('city');

      // Only include non-deleted entries
      queryBuilder.where('city.deletedAt IS NULL');

      // Apply search filter
      if (searchText) {
        queryBuilder.andWhere(
          `(
          city.cityName ILIKE :searchText OR 
          CAST(city.cityPincode AS TEXT) ILIKE :searchText OR 
          city.district ILIKE :searchText OR 
          city.state ILIKE :searchText
        )`,
          { searchText: `%${searchText}%` },
        );
      }

      // Count total first (without pagination)
      const total = await queryBuilder.getCount();

      // Apply sorting and pagination
      const cities = await queryBuilder
        .orderBy('city.createdAt', 'DESC')
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      const transformedCities = cities.map((city) =>
        plainToInstance(TransformAcceptedCitiesDto, city, {
          excludeExtraneousValues: true,
        }),
      );

      return {
        status: true,
        code: 200,
        data: {
          transformedCities,
          total,
          page,
          pageSize: limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Unable to fetch cities');
    }
  }

  async softDeleteById(id: string): Promise<baseResponseDto> {
    try {
      const existingCity = await this.acceptedCitiesRepository.findOneBy({ id });
      if (!existingCity) {
        throw new NotFoundException('City does not exist');
      }
      existingCity.deletedAt = dateToUTC();
      await this.acceptedCitiesRepository.save(existingCity);
      return {
        status: true,
        code: 200,
        data: { message: 'City deleted successfully' },
      };
    } catch (error) {
      throw new InternalServerErrorException('Unable to delete city');
    }
  }
}
