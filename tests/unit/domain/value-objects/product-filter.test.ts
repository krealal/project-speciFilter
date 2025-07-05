import { ProductFilter } from '../../../../src/domain/value-objects/product-filter';
import { Category } from '../../../../src/domain/value-objects/category';
import { Price } from '../../../../src/domain/value-objects/price';

describe('ProductFilter Value Object', () => {
  describe('creation', () => {
    it('should create an empty filter', () => {
      const filter = new ProductFilter();
      
      expect(filter.categories).toEqual([]);
      expect(filter.minPrice).toBeUndefined();
      expect(filter.maxPrice).toBeUndefined();
      expect(filter.isEmpty()).toBe(true);
    });

    it('should create a filter with categories only', () => {
      const categories = [new Category('food'), new Category('clothes')];
      const filter = new ProductFilter(categories);
      
      expect(filter.categories).toEqual(categories);
      expect(filter.minPrice).toBeUndefined();
      expect(filter.maxPrice).toBeUndefined();
      expect(filter.isEmpty()).toBe(false);
    });

    it('should create a filter with price range only', () => {
      const minPrice = new Price(1.00);
      const maxPrice = new Price(5.00);
      const filter = new ProductFilter([], minPrice, maxPrice);
      
      expect(filter.categories).toEqual([]);
      expect(filter.minPrice).toBe(minPrice);
      expect(filter.maxPrice).toBe(maxPrice);
      expect(filter.isEmpty()).toBe(false);
    });

    it('should create a filter with min price only', () => {
      const minPrice = new Price(1.00);
      const filter = new ProductFilter([], minPrice);
      
      expect(filter.categories).toEqual([]);
      expect(filter.minPrice).toBe(minPrice);
      expect(filter.maxPrice).toBeUndefined();
      expect(filter.isEmpty()).toBe(false);
    });

    it('should create a filter with max price only', () => {
      const maxPrice = new Price(5.00);
      const filter = new ProductFilter([], undefined, maxPrice);
      
      expect(filter.categories).toEqual([]);
      expect(filter.minPrice).toBeUndefined();
      expect(filter.maxPrice).toBe(maxPrice);
      expect(filter.isEmpty()).toBe(false);
    });

    it('should create a filter with categories and price range', () => {
      const categories = [new Category('food')];
      const minPrice = new Price(1.00);
      const maxPrice = new Price(5.00);
      const filter = new ProductFilter(categories, minPrice, maxPrice);
      
      expect(filter.categories).toEqual(categories);
      expect(filter.minPrice).toBe(minPrice);
      expect(filter.maxPrice).toBe(maxPrice);
      expect(filter.isEmpty()).toBe(false);
    });

    it('should throw error when min price is greater than max price', () => {
      const minPrice = new Price(5.00);
      const maxPrice = new Price(1.00);
      
      expect(() => {
        new ProductFilter([], minPrice, maxPrice);
      }).toThrow('Min price cannot be greater than max price');
    });

    it('should allow equal min and max prices', () => {
      const minPrice = new Price(5.00);
      const maxPrice = new Price(5.00);
      
      expect(() => {
        new ProductFilter([], minPrice, maxPrice);
      }).not.toThrow();
    });
  });

  describe('filtering logic', () => {
    it('should check if it has category filter', () => {
      const categories = [new Category('food')];
      const filter = new ProductFilter(categories);
      
      expect(filter.hasCategoryFilter()).toBe(true);
    });

    it('should check if it has no category filter', () => {
      const filter = new ProductFilter([]);
      
      expect(filter.hasCategoryFilter()).toBe(false);
    });

    it('should check if it has price filter', () => {
      const minPrice = new Price(1.00);
      const filter = new ProductFilter([], minPrice);
      
      expect(filter.hasPriceFilter()).toBe(true);
    });

    it('should check if it has no price filter', () => {
      const filter = new ProductFilter([]);
      
      expect(filter.hasPriceFilter()).toBe(false);
    });

    it('should check if category matches', () => {
      const categories = [new Category('food'), new Category('clothes')];
      const filter = new ProductFilter(categories);
      
      expect(filter.matchesCategory(new Category('food'))).toBe(true);
      expect(filter.matchesCategory(new Category('clothes'))).toBe(true);
      expect(filter.matchesCategory(new Category('toiletries'))).toBe(false);
    });

    it('should match any category when no category filter', () => {
      const filter = new ProductFilter([]);
      
      expect(filter.matchesCategory(new Category('food'))).toBe(true);
      expect(filter.matchesCategory(new Category('clothes'))).toBe(true);
    });

    it('should check if price matches range', () => {
      const minPrice = new Price(1.00);
      const maxPrice = new Price(5.00);
      const filter = new ProductFilter([], minPrice, maxPrice);
      
      expect(filter.matchesPrice(new Price(3.00))).toBe(true);
      expect(filter.matchesPrice(new Price(1.00))).toBe(true);
      expect(filter.matchesPrice(new Price(5.00))).toBe(true);
      expect(filter.matchesPrice(new Price(0.50))).toBe(false);
      expect(filter.matchesPrice(new Price(6.00))).toBe(false);
    });

    it('should match any price when no price filter', () => {
      const filter = new ProductFilter([]);
      
      expect(filter.matchesPrice(new Price(0.50))).toBe(true);
      expect(filter.matchesPrice(new Price(100.00))).toBe(true);
    });
  });

  describe('builder pattern', () => {
    it('should create filter with builder pattern', () => {
      const categories = [new Category('food')];
      const minPrice = new Price(1.00);
      const maxPrice = new Price(5.00);
      
      const filter = ProductFilter.builder()
        .withCategories(categories)
        .withMinPrice(minPrice)
        .withMaxPrice(maxPrice)
        .build();
      
      expect(filter.categories).toEqual(categories);
      expect(filter.minPrice).toBe(minPrice);
      expect(filter.maxPrice).toBe(maxPrice);
    });

    it('should create filter with price range using builder', () => {
      const minPrice = new Price(1.00);
      const maxPrice = new Price(5.00);
      
      const filter = ProductFilter.builder()
        .withPriceRange(minPrice, maxPrice)
        .build();
      
      expect(filter.minPrice).toBe(minPrice);
      expect(filter.maxPrice).toBe(maxPrice);
    });
  });
}); 