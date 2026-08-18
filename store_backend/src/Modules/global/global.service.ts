import { HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { AcceptedCitiesRepository } from 'Modules/Accepted_cities/Repositories/accepted-cities.Repo';
import { CategoryRepository } from 'Modules/Category/Repositories/Category.repo';
import { ProductRepository } from 'Modules/Product/Repositories/Product.repo';
import { SaleRepository } from 'Modules/Sale/Repositories/Sale.repo';
import { UserRepository } from 'Modules/User/Repositories/User.repo';
import { whatsappDetailsRepository } from 'Modules/Whatsapp_details/Repositories/WhatsappDetails.repo';
import { Like } from 'typeorm';

@Injectable()
export class GlobalService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly productRepository: ProductRepository,
    private readonly acceptedCitiesRepository: AcceptedCitiesRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly whatsappDetailsRepository: whatsappDetailsRepository,
    private readonly saleRepository: SaleRepository,
  ) {}

  async globalSearch(query: string): Promise<baseResponseDto> {
    const userQuery = this.userRepository
      .createQueryBuilder('user')
      .where('user.email LIKE :query', { query: `%${query}%` })
      .orWhere('user.mobileNumber LIKE :query', { query: `%${query}%` })
      .orWhere('user.firstName LIKE :query', { query: `%${query}%` })
      .orWhere('user.lastName LIKE :query', { query: `%${query}%` });

    const productQuery = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .where('product.name LIKE :query', { query: `%${query}%` })
      .orWhere('category.name LIKE :query', { query: `%${query}%` })
      .orWhere('CAST(product.price AS TEXT) LIKE :query', { query: `%${query}%` })
      .orWhere('CAST(product.quantity AS TEXT) LIKE :query', { query: `%${query}%` });

    const acceptedCitiesQuery = this.acceptedCitiesRepository
      .createQueryBuilder('city')
      .where('city.cityName LIKE :query', { query: `%${query}%` })
      .orWhere('city.district LIKE :query', { query: `%${query}%` })
      .orWhere('city.state LIKE :query', { query: `%${query}%` })
      .orWhere('CAST(city.cityPincode AS TEXT) LIKE :query', { query: `%${query}%` });

    const categoryQuery = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.name LIKE :query', { query: `%${query}%` })
      .orWhere('category.description LIKE :query', { query: `%${query}%` });

    const saleQuery = this.saleRepository
      .createQueryBuilder('sale')
      .leftJoinAndSelect('sale.buyer', 'buyer')
      .leftJoinAndSelect('sale.products', 'product')
      .leftJoinAndSelect('sale.receivedPayment', 'payment')
      .where('buyer.firstName LIKE :query', { query: `%${query}%` })
      .orWhere('buyer.lastName LIKE :query', { query: `%${query}%` })
      .orWhere('product.name LIKE :query', { query: `%${query}%` })
      .orWhere('CAST(payment.amount AS TEXT) LIKE :query', {
        query: `%${query}%`,
      });

    try {
      const [users, products, acceptedCities, categories, sales, whatsapp] = await Promise.all([
        userQuery.getMany(),
        productQuery.getMany(),
        acceptedCitiesQuery.getMany(),
        categoryQuery.getMany(),
        saleQuery.getMany(),
        this.whatsappDetailsRepository.findBy({ name: Like(`%${query}%`) }),
      ]);

      return {
        code: 200,
        status: true,
        data: {
          users,
          products,
          acceptedCities,
          categories,
          sales,
          whatsapp,
        },
      };
    } catch (error) {
      console.error('Error executing global search:', error);
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(
        error?.message
          ? `Error executing global search: ${error.message}`
          : 'Error executing global search',
      );
    }
  }
}
