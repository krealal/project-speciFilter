import { ProductFilter, ProductFilterBuilder } from '../src/ProductFilter';
import { Product } from '../src/Product';

describe('Builder Pattern Tests', () => {
  const sampleProduct = new Product('1', 'Test Product', 10.99, ['food'], true);

  describe('ProductFilterBuilder', () => {
    it('should create empty filter when no conditions are set', () => {
      const filter = ProductFilter.builder().build();
      
      expect(filter.isEmpty()).toBe(true);
      expect(filter.matches(sampleProduct)).toBe(true);
    });

    it('should build filter with categories using withCategories()', () => {
      const filter = ProductFilter.builder()
        .withCategories(['food', 'clothes'])
        .build();
      
      expect(filter.matches(sampleProduct)).toBe(true);
      expect(filter.matches(new Product('2', 'Test', 5, ['electronics'], true))).toBe(false);
    });

    it('should build filter with single category using withCategory()', () => {
      const filter = ProductFilter.builder()
        .withCategory('food')
        .build();
      
      expect(filter.matches(sampleProduct)).toBe(true);
      expect(filter.matches(new Product('2', 'Test', 5, ['clothes'], true))).toBe(false);
    });

    it('should build filter with multiple categories using withCategory() chaining', () => {
      const filter = ProductFilter.builder()
        .withCategory('food')
        .withCategory('clothes')
        .build();
      
      expect(filter.matches(sampleProduct)).toBe(true);
      expect(filter.matches(new Product('2', 'Test', 5, ['clothes'], true))).toBe(true);
      expect(filter.matches(new Product('3', 'Test', 5, ['electronics'], true))).toBe(false);
    });

    it('should build filter with minimum price using withMinPrice()', () => {
      const filter = ProductFilter.builder()
        .withMinPrice(5.00)
        .build();
      
      expect(filter.matches(sampleProduct)).toBe(true);
      expect(filter.matches(new Product('2', 'Test', 3, ['food'], true))).toBe(false);
    });

    it('should build filter with maximum price using withMaxPrice()', () => {
      const filter = ProductFilter.builder()
        .withMaxPrice(15.00)
        .build();
      
      expect(filter.matches(sampleProduct)).toBe(true);
      expect(filter.matches(new Product('2', 'Test', 20, ['food'], true))).toBe(false);
    });

    it('should build filter with price range using withPriceRange()', () => {
      const filter = ProductFilter.builder()
        .withPriceRange(5.00, 15.00)
        .build();
      
      expect(filter.matches(sampleProduct)).toBe(true);
      expect(filter.matches(new Product('2', 'Test', 3, ['food'], true))).toBe(false);
      expect(filter.matches(new Product('3', 'Test', 20, ['food'], true))).toBe(false);
    });

    it('should build filter with stock filter using withStockFilter()', () => {
      const filter = ProductFilter.builder()
        .withStockFilter(true)
        .build();
      
      expect(filter.matches(sampleProduct)).toBe(true);
      expect(filter.matches(new Product('2', 'Test', 10, ['food'], false))).toBe(false);
    });

    it('should build filter with in stock only using withInStockOnly()', () => {
      const filter = ProductFilter.builder()
        .withInStockOnly()
        .build();
      
      expect(filter.matches(sampleProduct)).toBe(true);
      expect(filter.matches(new Product('2', 'Test', 10, ['food'], false))).toBe(false);
    });

    it('should build filter with out of stock only using withOutOfStockOnly()', () => {
      const filter = ProductFilter.builder()
        .withOutOfStockOnly()
        .build();
      
      expect(filter.matches(sampleProduct)).toBe(false);
      expect(filter.matches(new Product('2', 'Test', 10, ['food'], false))).toBe(true);
    });

    it('should allow method chaining (fluent interface)', () => {
      const filter = ProductFilter.builder()
        .withCategories(['food'])
        .withMinPrice(5.00)
        .withMaxPrice(15.00)
        .withInStockOnly()
        .build();
      
      expect(filter.matches(sampleProduct)).toBe(true);
      expect(filter.matches(new Product('2', 'Test', 3, ['food'], true))).toBe(false); // price too low
      expect(filter.matches(new Product('3', 'Test', 12, ['clothes'], true))).toBe(false); // wrong category
      expect(filter.matches(new Product('4', 'Test', 12, ['food'], false))).toBe(false); // out of stock
    });

    it('should return new builder instance each time', () => {
      const builder1 = ProductFilter.builder();
      const builder2 = ProductFilter.builder();
      
      expect(builder1).not.toBe(builder2);
    });

    it('should create complex filter combinations', () => {
      const complexFilter = ProductFilter.builder()
        .withCategory('food')
        .withCategory('free-shipping')
        .withPriceRange(0.50, 2.00)
        .withInStockOnly()
        .build();
      
      const matchingProduct = new Product('1', 'Apple', 0.99, ['food', 'free-shipping'], true);
      const nonMatchingProduct1 = new Product('2', 'Banana', 1.50, ['food'], false); // out of stock
      const nonMatchingProduct2 = new Product('3', 'Orange', 3.00, ['food'], true); // too expensive
      
      expect(complexFilter.matches(matchingProduct)).toBe(true);
      expect(complexFilter.matches(nonMatchingProduct1)).toBe(false);
      expect(complexFilter.matches(nonMatchingProduct2)).toBe(false);
    });
  });
}); 