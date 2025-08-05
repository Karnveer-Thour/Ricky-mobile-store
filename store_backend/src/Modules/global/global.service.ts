import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { baseResponseDto } from 'Common/Dto/BaseResponse.dto';
import { AcceptedCitiesRepository } from 'Modules/Accepted_cities/Repositories/accepted-cities.Repo';
import { CategoryRepository } from 'Modules/Category/Repositories/Category.repo';
import { ProductRepository } from 'Modules/Product/Repositories/Product.repo';
import { SaleRepository } from 'Modules/Sale/Repositories/Sale.repo';
import { UserRepository } from 'Modules/User/Repositories/User.repo';
import { whatsappDetailsRepository } from 'Modules/Whatsapp_details/Repositories/WhatsappDetails.repo';
import {ILike } from 'typeorm';

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
    .where('LOWER(user.email) ILIKE LOWER(:query)', { query: `%${query}%` })
    .orWhere('LOWER(user.mobileNumber) ILIKE LOWER(:query)', { query: `%${query}%` })
    .orWhere(`LOWER(CONCAT(user.firstName, ' ', user.lastName)) ILIKE LOWER(:query)`, {
      query: `%${query}%`,
    })
    .orWhere(`LOWER(CONCAT(user.lastName, ' ', user.firstName)) ILIKE LOWER(:query)`, {
      query: `%${query}%`,
    });

  const productQuery = this.productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect('product.category', 'category')
    .where('LOWER(product.name) ILIKE LOWER(:query)', { query: `%${query}%` })
    .orWhere('LOWER(category.name) ILIKE LOWER(:query)', { query: `%${query}%` })
    .orWhere('CAST(product.price AS TEXT) ILIKE LOWER(:query)', { query: `%${query}%` })
    .orWhere('CAST(product.quantity AS TEXT) ILIKE LOWER(:query)', { query: `%${query}%` });

  const acceptedCitiesQuery = this.acceptedCitiesRepository
    .createQueryBuilder('city')
    .where('LOWER(city.cityName) ILIKE LOWER(:query)', { query: `%${query}%` })
    .orWhere('LOWER(city.district) ILIKE LOWER(:query)', { query: `%${query}%` })
    .orWhere('LOWER(city.state) ILIKE LOWER(:query)', { query: `%${query}%` })
    .orWhere('CAST(city.cityPincode AS TEXT) ILIKE LOWER(:query)', { query: `%${query}%` });

  const categoryQuery = this.categoryRepository
    .createQueryBuilder('category')
    .where('LOWER(category.name) ILIKE LOWER(:query)', { query: `%${query}%` })
    .orWhere('LOWER(category.description) ILIKE LOWER(:query)', { query: `%${query}%` });

  const saleQuery = this.saleRepository
    .createQueryBuilder('sale')
    .leftJoinAndSelect('sale.buyer', 'buyer')
    .leftJoinAndSelect('sale.products', 'product')
    .leftJoinAndSelect('sale.receivedPayment', 'payment')
    .where(`LOWER(CONCAT(buyer.firstName, ' ', buyer.lastName)) ILIKE LOWER(:query)`, {
      query: `%${query}%`,
    })
    .orWhere('LOWER(product.name) ILIKE LOWER(:query)', { query: `%${query}%` })
    .orWhere('CAST(payment.amount AS TEXT) ILIKE LOWER(:query)', {
      query: `%${query}%`,
    });

  try {
    const [users, products, acceptedCities, categories, sales, whatsapp] = await Promise.all([
      userQuery.getMany(),
      productQuery.getMany(),
      acceptedCitiesQuery.getMany(),
      categoryQuery.getMany(),
      saleQuery.getMany(),
      this.whatsappDetailsRepository.findBy({ name: ILike(`%${query}%`) }),
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
    throw new InternalServerErrorException('Error executing global search', error);
  }
}

}
