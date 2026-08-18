import { ProductReviewRepository } from './Repositories/ProductReview.repo';
import { ProductRepository } from '../Product/Repositories/Product.repo';
import { UserRepository } from '../User/Repositories/User.repo';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductReviewService } from './product-review.service';

describe('ProductReviewService', () => {
  let service: ProductReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductReviewService,
        { provide: ProductReviewRepository, useValue: { find: jest.fn() } },
        { provide: ProductRepository, useValue: { findOneBy: jest.fn() } },
        { provide: UserRepository, useValue: { findOneBy: jest.fn() } },
      ],
    }).compile();

    service = module.get<ProductReviewService>(ProductReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
