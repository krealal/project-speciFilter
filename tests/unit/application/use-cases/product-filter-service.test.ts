import { ProductFilterService } from '../../../../src/application/use-cases/product-filter-service';
import { ProductRepository } from '../../../../src/domain/repositories/product-repository';
import { Product } from '../../../../src/domain/entities/product';
import { Category } from '../../../../src/domain/value-objects/category';
import { Price } from '../../../../src/domain/value-objects/price';
import { ProductFilter } from '../../../../src/domain/value-objects/product-filter';

// Mock ProductRepository
class MockProductRepository implements ProductRepository {
  private products: Product[] = [];

  constructor(products: Product[] = []) {
    this.products = [...products];
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
    this.products = this.products.filter(product => product.id !== id);
  }
}

describe('ProductFilterService', () => {
  let service: ProductFilterService;
  let repository: MockProductRepository;
  let sampleProducts: Product[];

  beforeEach(() => {
    sampleProducts = [
      new Product(
        '1',
        'Apple',
        new Price(0.99),
        [new Category('food'), new Category('free-shipping')],
        true
      ),
      new Product(
        '2',
        'Banana',
        new Price(1.50),
        [new Category('food')],
        false
      ),
      new Product(
        '3',
        'T-Shirt',
        new Price(15.99),
        [new Category('clothes'), new Category('new')],
        true
      ),
      new Product(
        '4',
        'Shampoo',
        new Price(8.50),
        [new Category('toiletries'), new Category('offer')],
        true
      ),
      new Product(
        '5',
        'Expensive Watch',
        new Price(299.99),
        [new Category('limited-edition')],
        false
      )
    ];

    repository = new MockProductRepository(sampleProducts);
    service = new ProductFilterService(repository);
  });

  describe('filterProducts', () => {
    it('should return all products when no filter is provided', async () => {
      const filter = new ProductFilter();
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(5);
      // Products with stock should come first
      expect(result[0].hasStock).toBe(true);
      expect(result[1].hasStock).toBe(true);
      expect(result[2].hasStock).toBe(true);
      // Then products without stock
      expect(result[3].hasStock).toBe(false);
      expect(result[4].hasStock).toBe(false);
    });

    it('should filter by category and sort by stock', async () => {
      const filter = new ProductFilter([new Category('food')]);
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(2);
      expect(result.every(p => p.belongsToCategory(new Category('food')))).toBe(true);
      // Apple (with stock) should come before Banana (without stock)
      expect(result[0].name).toBe('Apple');
      expect(result[0].hasStock).toBe(true);
      expect(result[1].name).toBe('Banana');
      expect(result[1].hasStock).toBe(false);
    });

    it('should filter by price range and sort by stock', async () => {
      const filter = new ProductFilter(
        [],
        new Price(1.00),
        new Price(20.00)
      );
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(3);
      expect(result.every(p => 
        p.price.greaterThanOrEqual(new Price(1.00)) && 
        p.price.lessThanOrEqual(new Price(20.00))
      )).toBe(true);
      // Products with stock should come first
      expect(result[0].hasStock).toBe(true);
      expect(result[1].hasStock).toBe(true);
      expect(result[2].hasStock).toBe(false);
    });

    it('should filter by category and price range', async () => {
      const filter = new ProductFilter(
        [new Category('food')],
        new Price(1.00),
        new Price(2.00)
      );
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Banana');
    });

    it('should return empty array when no products match filter', async () => {
      const filter = new ProductFilter(
        [new Category('food')],
        new Price(100.00),
        new Price(200.00)
      );
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(0);
    });

    it('should handle multiple categories filter', async () => {
      const filter = new ProductFilter([
        new Category('food'),
        new Category('clothes')
      ]);
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(3);
      // Should include products from both categories
      const hasFood = result.some(p => p.belongsToCategory(new Category('food')));
      const hasClothes = result.some(p => p.belongsToCategory(new Category('clothes')));
      expect(hasFood).toBe(true);
      expect(hasClothes).toBe(true);
    });

    it('should sort products with stock first regardless of other factors', async () => {
      const filter = new ProductFilter();
      const result = await service.filterProducts(filter);
      
      // Count products with stock that come first
      let stockProductsCount = 0;
      for (const product of result) {
        if (product.hasStock) {
          stockProductsCount++;
        } else {
          break; // First product without stock found
        }
      }
      
      expect(stockProductsCount).toBe(3); // Apple, T-Shirt, Shampoo
      
      // Verify no products without stock come before products with stock
      let foundWithoutStock = false;
      for (const product of result) {
        if (!product.hasStock) {
          foundWithoutStock = true;
        } else if (foundWithoutStock) {
          fail('Product with stock found after product without stock');
        }
      }
    });
  });

  describe('getAllProducts', () => {
    it('should return all products sorted by stock', async () => {
      const result = await service.getAllProducts();
      
      expect(result).toHaveLength(5);
      // First 3 should have stock
      expect(result[0].hasStock).toBe(true);
      expect(result[1].hasStock).toBe(true);
      expect(result[2].hasStock).toBe(true);
      // Last 2 should not have stock
      expect(result[3].hasStock).toBe(false);
      expect(result[4].hasStock).toBe(false);
    });

    it('should return empty array when no products exist', async () => {
      const emptyRepository = new MockProductRepository([]);
      const emptyService = new ProductFilterService(emptyRepository);
      
      const result = await emptyService.getAllProducts();
      
      expect(result).toHaveLength(0);
    });
  });

  describe('getProductById', () => {
    it('should return product when found', async () => {
      const result = await service.getProductById('1');
      
      expect(result).not.toBeNull();
      expect(result?.id).toBe('1');
      expect(result?.name).toBe('Apple');
    });

    it('should return null when product not found', async () => {
      const result = await service.getProductById('999');
      
      expect(result).toBeNull();
    });
  });

  describe('error handling', () => {
    it('should handle repository errors gracefully', async () => {
      const errorRepository = {
        findAll: jest.fn().mockRejectedValue(new Error('Database error')),
        findByFilter: jest.fn().mockRejectedValue(new Error('Database error')),
        findById: jest.fn().mockRejectedValue(new Error('Database error')),
        save: jest.fn().mockRejectedValue(new Error('Database error')),
        delete: jest.fn().mockRejectedValue(new Error('Database error'))
      };

      const errorService = new ProductFilterService(errorRepository);
      
      await expect(errorService.getAllProducts()).rejects.toThrow('Database error');
      await expect(errorService.filterProducts(new ProductFilter())).rejects.toThrow('Database error');
      await expect(errorService.getProductById('1')).rejects.toThrow('Database error');
    });
  });
}); 