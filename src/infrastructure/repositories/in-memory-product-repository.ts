import { ProductRepository } from '../../domain/repositories/product-repository';
import { Product } from '../../domain/entities/product';
import { ProductFilter } from '../../domain/value-objects/product-filter';

export class InMemoryProductRepository implements ProductRepository {
  private products: Product[] = [];

  constructor(initialProducts: Product[] = []) {
    this.products = [...initialProducts];
  }

  async findAll(): Promise<Product[]> {
    return [...this.products];
  }

  async findByFilter(filter: ProductFilter): Promise<Product[]> {
    return this.products.filter(product => {
      if (filter.hasCategoryFilter()) {
        const hasMatchingCategory = product.categories.some(category =>
          filter.matchesCategory(category)
        );
        if (!hasMatchingCategory) {
          return false;
        }
      }

      if (filter.hasPriceFilter()) {
        if (!filter.matchesPrice(product.price)) {
          return false;
        }
      }

      return true;
    });
  }

  async findById(id: string): Promise<Product | null> {
    if (!id || id.trim() === '') {
      return null;
    }

    return this.products.find(product => product.id === id) || null;
  }

  async save(product: Product): Promise<void> {
    const index = this.products.findIndex(p => p.id === product.id);
    
    if (index >= 0) {
      this.products[index] = product;
    } else {
      this.products.push(product);
    }
  }

  async delete(id: string): Promise<void> {
    if (!id || id.trim() === '') {
      return;
    }

    this.products = this.products.filter(product => product.id !== id);
  }
} 