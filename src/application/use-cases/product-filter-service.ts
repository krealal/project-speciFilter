import { ProductRepository } from '../../domain/repositories/product-repository';
import { Product } from '../../domain/entities/product';
import { ProductFilter } from '../../domain/value-objects/product-filter';

export class ProductFilterService {
  constructor(private readonly productRepository: ProductRepository) {}

  async filterProducts(filter: ProductFilter): Promise<Product[]> {
    const products = await this.productRepository.findByFilter(filter);
    return this.sortByStock(products);
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productRepository.findAll();
    return this.sortByStock(products);
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  private sortByStock(products: Product[]): Product[] {
    return products.sort((a, b) => {
      if (a.hasStock === b.hasStock) {
        return 0;
      }
      if (a.hasStock && !b.hasStock) {
        return -1;
      }
      return 1;
    });
  }
} 