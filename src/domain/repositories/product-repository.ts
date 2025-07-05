import { Product } from '../entities/product';
import { ProductFilter } from '../value-objects/product-filter';

export interface ProductRepository {
  findAll(): Promise<Product[]>;

  findByFilter(filter: ProductFilter): Promise<Product[]>;

  findById(id: string): Promise<Product | null>;

  save(product: Product): Promise<void>;

  delete(id: string): Promise<void>;
} 