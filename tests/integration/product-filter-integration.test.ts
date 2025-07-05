import { ProductFilterService } from '../../src/application/use-cases/product-filter-service';
import { InMemoryProductRepository } from '../../src/infrastructure/repositories/in-memory-product-repository';
import { Product } from '../../src/domain/entities/product';
import { Category } from '../../src/domain/value-objects/category';
import { Price } from '../../src/domain/value-objects/price';
import { ProductFilter } from '../../src/domain/value-objects/product-filter';

describe('Product Filter Integration Tests', () => {
  let service: ProductFilterService;
  let repository: InMemoryProductRepository;

  beforeEach(() => {
    const sampleProducts = [
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
        'Limited Watch',
        new Price(299.99),
        [new Category('limited-edition')],
        false
      ),
      new Product(
        '6',
        'Designer Jeans',
        new Price(89.99),
        [new Category('clothes'), new Category('offer')],
        true
      )
    ];

    repository = new InMemoryProductRepository(sampleProducts);
    service = new ProductFilterService(repository);
  });

  describe('End-to-End Product Filtering', () => {
    it('should return all products with stock first when no filter applied', async () => {
      const filter = new ProductFilter();
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(6);
      
      const productsWithStock = result.filter(p => p.hasStock);
      const productsWithoutStock = result.filter(p => !p.hasStock);
      
      expect(productsWithStock).toHaveLength(4);
      expect(productsWithoutStock).toHaveLength(2);
      
      const firstWithoutStockIndex = result.findIndex(p => !p.hasStock);
      const lastWithStockIndex = result.map(p => p.hasStock).lastIndexOf(true);
      
      expect(firstWithoutStockIndex).toBeGreaterThan(lastWithStockIndex);
    });

    it('should filter by single category and maintain stock ordering', async () => {
      const filter = new ProductFilter([new Category('food')]);
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(2);
      expect(result.every(p => p.belongsToCategory(new Category('food')))).toBe(true);
      
      expect(result[0].name).toBe('Apple');
      expect(result[0].hasStock).toBe(true);
      expect(result[1].name).toBe('Banana');
      expect(result[1].hasStock).toBe(false);
    });

    it('should filter by multiple categories', async () => {
      const filter = new ProductFilter([
        new Category('clothes'),
        new Category('toiletries')
      ]);
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(3);
      
      const hasClothes = result.some(p => p.belongsToCategory(new Category('clothes')));
      const hasToiletries = result.some(p => p.belongsToCategory(new Category('toiletries')));
      
      expect(hasClothes).toBe(true);
      expect(hasToiletries).toBe(true);
      
      expect(result[0].hasStock).toBe(true);
      expect(result[1].hasStock).toBe(true);
      expect(result[2].hasStock).toBe(true);
    });

    it('should filter by price range', async () => {
      const filter = new ProductFilter(
        [],
        new Price(5.00),
        new Price(20.00)
      );
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(2);
      expect(result.every(p => 
        p.price.greaterThanOrEqual(new Price(5.00)) && 
        p.price.lessThanOrEqual(new Price(20.00))
      )).toBe(true);
      
      expect(result.every(p => p.hasStock)).toBe(true);
    });

    it('should filter by category and price range combined', async () => {
      const filter = new ProductFilter(
        [new Category('clothes')],
        new Price(10.00),
        new Price(100.00)
      );
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(2);
      expect(result.every(p => p.belongsToCategory(new Category('clothes')))).toBe(true);
      expect(result.every(p => 
        p.price.greaterThanOrEqual(new Price(10.00)) && 
        p.price.lessThanOrEqual(new Price(100.00))
      )).toBe(true);
      
      expect(result.every(p => p.hasStock)).toBe(true);
    });

    it('should handle empty result when no products match filter', async () => {
      const filter = new ProductFilter(
        [new Category('food')],
        new Price(100.00),
        new Price(200.00)
      );
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(0);
    });

    it('should handle edge case of exact price match', async () => {
      const filter = new ProductFilter(
        [],
        new Price(15.99),
        new Price(15.99)
      );
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('T-Shirt');
      expect(result[0].price.value).toBe(15.99);
    });
  });

  describe('Builder Pattern Integration', () => {
    it('should work with ProductFilter builder pattern', async () => {
      const filter = ProductFilter.builder()
        .withCategories([new Category('clothes')])
        .withPriceRange(new Price(10.00), new Price(100.00))
        .build();
      
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(2);
      expect(result.every(p => p.belongsToCategory(new Category('clothes')))).toBe(true);
    });

    it('should work with builder pattern for price-only filters', async () => {
      const filter = ProductFilter.builder()
        .withMinPrice(new Price(50.00))
        .build();
      
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(2);
      expect(result.every(p => p.price.greaterThanOrEqual(new Price(50.00)))).toBe(true);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should handle "free shipping" food products under 2 euros', async () => {
      const filter = new ProductFilter(
        [new Category('food'), new Category('free-shipping')],
        undefined,
        new Price(2.00)
      );
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(2);
      const productNames = result.map(p => p.name);
      expect(productNames).toContain('Apple');
      expect(productNames).toContain('Banana');
    });

    it('should handle "offer" products in mid-price range', async () => {
      const filter = new ProductFilter(
        [new Category('offer')],
        new Price(5.00),
        new Price(100.00)
      );
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(2);
      expect(result.every(p => p.belongsToCategory(new Category('offer')))).toBe(true);
      
      const productNames = result.map(p => p.name);
      expect(productNames).toContain('Shampoo');
      expect(productNames).toContain('Designer Jeans');
    });

    it('should handle luxury products (limited-edition)', async () => {
      const filter = new ProductFilter([new Category('limited-edition')]);
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Limited Watch');
      expect(result[0].hasStock).toBe(false);
    });

    it('should handle new arrivals with stock', async () => {
      const filter = new ProductFilter([new Category('new')]);
      const result = await service.filterProducts(filter);
      
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('T-Shirt');
      expect(result[0].hasStock).toBe(true);
    });
  });

  describe('Data Integrity', () => {
    it('should maintain product data integrity across operations', async () => {
      const originalProduct = await service.getProductById('1');
      expect(originalProduct?.name).toBe('Apple');
      
      const filter = new ProductFilter([new Category('food')]);
      const filteredProducts = await service.filterProducts(filter);
      
      const productAfterFilter = await service.getProductById('1');
      expect(productAfterFilter).toEqual(originalProduct);

      expect(filteredProducts).toHaveLength(2);
      expect(filteredProducts.find(p => p.id === '1')).toEqual(originalProduct);
    });

    it('should handle concurrent filter operations', async () => {
      const filter1 = new ProductFilter([new Category('food')]);
      const filter2 = new ProductFilter([new Category('clothes')]);
      const filter3 = new ProductFilter([], new Price(10.00), new Price(20.00));
      
      const [result1, result2, result3] = await Promise.all([
        service.filterProducts(filter1),
        service.filterProducts(filter2),
        service.filterProducts(filter3)
      ]);
      
      expect(result1).toHaveLength(2);
      expect(result2).toHaveLength(2);
      expect(result3).toHaveLength(1);
      
      expect(result1.every(p => p.belongsToCategory(new Category('food')))).toBe(true);
      expect(result2.every(p => p.belongsToCategory(new Category('clothes')))).toBe(true);
      expect(result3.every(p => 
        p.price.greaterThanOrEqual(new Price(10.00)) && 
        p.price.lessThanOrEqual(new Price(20.00))
      )).toBe(true);
    });
  });
}); 