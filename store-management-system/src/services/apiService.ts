import { productService, DashboardProduct } from './product.service';
import { categoryService } from './category.service';
import { cityService } from './city.service';
import { customerService } from './customer.service';
import { uploadService } from './upload.service';
import { orderService } from './order.service';
import { searchService } from './search.service';

export type { DashboardProduct };

export {
  productService,
  categoryService,
  cityService,
  customerService,
  uploadService,
  orderService,
  searchService,
};

export const adminApiService = {
  ...uploadService,
  ...productService,
  ...categoryService,
  ...cityService,
  ...customerService,
  ...searchService,
  ...orderService,
};
