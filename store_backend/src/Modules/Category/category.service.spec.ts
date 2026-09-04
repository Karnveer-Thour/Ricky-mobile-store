import { CategoryRepository } from './Repositories/Category.repo';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let service: CategoryService;
  let mockCategoryRepository: any;

  beforeEach(async () => {
    mockCategoryRepository = {
      find: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService, { provide: CategoryRepository, useValue: mockCategoryRepository }],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a category with hasColors: false and hasVariants: true', async () => {
    mockCategoryRepository.findOneBy.mockResolvedValue(null);
    const categoryDto = {
      name: 'Charging Accessories',
      description: 'Fast chargers and cables',
      hasColors: false,
      hasVariants: true,
    };
    mockCategoryRepository.save.mockImplementation((cat: any) =>
      Promise.resolve({ id: 'cat-123', ...cat }),
    );

    const result = await service.create(categoryDto as any);

    expect(result.code).toBe(201);
    expect(result.status).toBe(true);
    expect(result.data).toEqual(expect.objectContaining({
      id: 'cat-123',
      name: 'Charging Accessories',
      hasColors: false,
      hasVariants: true,
    }));
    expect(mockCategoryRepository.save).toHaveBeenCalledWith(categoryDto);
  });

  it('should update hasColors and hasVariants on existing category', async () => {
    const existing = {
      id: 'cat-456',
      name: 'Mobiles',
      description: 'Smartphones',
      hasColors: true,
      hasVariants: false,
    };
    mockCategoryRepository.findOneBy.mockResolvedValue(existing);
    mockCategoryRepository.save.mockImplementation((cat: any) => Promise.resolve(cat));

    const updateDto = {
      hasColors: false,
      hasVariants: true,
    };

    const result = await service.update('cat-456', updateDto as any);

    expect(result.code).toBe(200);
    expect(result.status).toBe(true);
    expect(existing.hasColors).toBe(false);
    expect(existing.hasVariants).toBe(true);
    expect(mockCategoryRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'cat-456',
        hasColors: false,
        hasVariants: true,
      }),
    );
  });
});
