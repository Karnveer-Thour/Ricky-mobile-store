import { Test, TestingModule } from '@nestjs/testing';
import { ProductCsvService } from './product-csv.service';
import { Product } from '../Entities/Product.entity';
import { Response } from 'express';

describe('ProductCsvService', () => {
  let service: ProductCsvService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductCsvService],
    }).compile();

    service = module.get<ProductCsvService>(ProductCsvService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('downloadCSV', () => {
    it('should format products and send CSV to response', async () => {
      const mockProducts = [
        {
          id: 1,
          name: 'iPhone 15',
          price: 999,
          discount: 10,
          quantity: 10,
          warranty: '1 Year',
          description: 'Flagship phone',
          specifications: 'A16 Bionic',
          category: { name: 'Smartphones' },
          colors: [{ name: 'Black', quantity: 5 }],
          variants: [{ ram: '6GB', storage: '128GB', color: 'Black', quantity: 5 }],
        },
      ] as unknown as Product[];

      const mockRes = {
        header: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        headersSent: false,
      } as unknown as Response;

      await service.downloadCSV(mockProducts, mockRes);

      expect(mockRes.header).toHaveBeenCalledWith('Content-Type', 'text/csv');
      expect(mockRes.header).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename=products.csv',
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalled();
      const sentCsv = (mockRes.send as jest.Mock).mock.calls[0][0];
      expect(sentCsv).toContain('iPhone 15');
      expect(sentCsv).toContain('Smartphones');
      expect(sentCsv).toContain('6GB 128GB Black (5)');
    });

    it('should handle products with empty variants and colors', async () => {
      const mockProducts = [
        {
          id: 2,
          name: 'Basic Phone',
          price: 50,
          discount: 0,
          quantity: 5,
          warranty: '6 Months',
          description: 'Basic',
          specifications: 'None',
          category: { name: 'Feature Phones' },
          colors: [],
          variants: [],
        },
      ] as unknown as Product[];

      const mockRes = {
        header: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        headersSent: false,
      } as unknown as Response;

      await service.downloadCSV(mockProducts, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalled();
      const sentCsv = (mockRes.send as jest.Mock).mock.calls[0][0];
      expect(sentCsv).toContain('Basic Phone');
      expect(sentCsv).toContain('Default (5)');
    });
  });
});
