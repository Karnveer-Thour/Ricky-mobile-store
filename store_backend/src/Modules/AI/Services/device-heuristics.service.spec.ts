import { Test, TestingModule } from '@nestjs/testing';
import { DeviceHeuristicsService } from './device-heuristics.service';

describe('DeviceHeuristicsService', () => {
  let service: DeviceHeuristicsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeviceHeuristicsService],
    }).compile();

    service = module.get<DeviceHeuristicsService>(DeviceHeuristicsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return Apple iPhone Pro presets for iPhone 15 Pro', () => {
    const res = service.getOfflineEnrichedProduct('iPhone 15 Pro', 'Smartphones', 129999);
    expect(res.description).toContain('titanium');
    expect(res.specifications).toContain('Apple A17 Pro');
    expect(res.warranty).toContain('Apple');
    expect(res.colors.some((c) => c.name.includes('Titanium'))).toBe(true);
    expect(res.images.length).toBeGreaterThanOrEqual(3);
  });

  it('should return Samsung Ultra presets for Galaxy S24 Ultra', () => {
    const res = service.getOfflineEnrichedProduct(
      'Samsung Galaxy S24 Ultra',
      'Smartphones',
      119999,
    );
    expect(res.description).toContain('Galaxy AI');
    expect(res.specifications).toContain('Snapdragon 8 Gen 3');
    expect(res.colors.some((c) => c.name.includes('Titanium'))).toBe(true);
  });

  it('should return OnePlus presets for OnePlus 12', () => {
    const res = service.getOfflineEnrichedProduct('OnePlus 12', 'Smartphones', 64999);
    expect(res.description).toContain('Hasselblad');
    expect(res.specifications).toContain('SUPERVOOC');
  });

  it('should return Audio presets for Sony WH-1000XM5 headphones', () => {
    const res = service.getOfflineEnrichedProduct('Sony WH-1000XM5', 'Audio', 29990);
    expect(res.specifications).toContain('Noise Cancelation');
    expect(res.warranty).toContain('1 Year Official Brand Warranty');
  });

  it('should return default presets for generic device', () => {
    const res = service.getOfflineEnrichedProduct('Generic Feature Phone', 'Phones', 1500);
    expect(res.description).toBeDefined();
    expect(res.specifications).toBeDefined();
    expect(res.colors.length).toBeGreaterThan(0);
  });
});
