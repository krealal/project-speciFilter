import { Product } from '../../../../src/domain/entities/product';
import { Category } from '../../../../src/domain/value-objects/category';
import { Price } from '../../../../src/domain/value-objects/price';

describe('Product Entity', () => {
  describe('creation', () => {
    it('should create a product with all properties', () => {
      const categories = [
        new Category('food'),
        new Category('free-shipping')
      ];
      const price = new Price(0.99);
      
      const product = new Product('3', 'Apple', price, categories, true);
      
      expect(product.id).toBe('3');
      expect(product.name).toBe('Apple');
      expect(product.price).toBe(price);
      expect(product.categories).toEqual(categories);
      expect(product.hasStock).toBe(true);
    });

    it('should create a product without stock', () => {
      const categories = [new Category('food')];
      const price = new Price(1.50);
      
      const product = new Product('1', 'Banana', price, categories, false);
      
      expect(product.hasStock).toBe(false);
    });

    it('should throw error when id is empty', () => {
      const categories = [new Category('food')];
      const price = new Price(1.50);
      
      expect(() => {
        new Product('', 'Banana', price, categories, false);
      }).toThrow('Product id cannot be empty');
    });

    it('should throw error when name is empty', () => {
      const categories = [new Category('food')];
      const price = new Price(1.50);
      
      expect(() => {
        new Product('1', '', price, categories, false);
      }).toThrow('Product name cannot be empty');
    });

    it('should throw error when categories array is empty', () => {
      const price = new Price(1.50);
      
      expect(() => {
        new Product('1', 'Banana', price, [], false);
      }).toThrow('Product must have at least one category');
    });
  });

  describe('methods', () => {
    it('should check if product belongs to a category', () => {
      const categories = [
        new Category('food'),
        new Category('free-shipping')
      ];
      const price = new Price(0.99);
      const product = new Product('3', 'Apple', price, categories, true);
      
      expect(product.belongsToCategory(new Category('food'))).toBe(true);
      expect(product.belongsToCategory(new Category('clothes'))).toBe(false);
    });

    it('should check if product is in price range', () => {
      const categories = [new Category('food')];
      const price = new Price(1.50);
      const product = new Product('1', 'Banana', price, categories, true);
      
      expect(product.isInPriceRange(new Price(1.00), new Price(2.00))).toBe(true);
      expect(product.isInPriceRange(new Price(0.50), new Price(1.00))).toBe(false);
      expect(product.isInPriceRange(new Price(2.00), new Price(3.00))).toBe(false);
    });

    it('should handle price range with only minimum value', () => {
      const categories = [new Category('food')];
      const price = new Price(1.50);
      const product = new Product('1', 'Banana', price, categories, true);
      
      expect(product.isInPriceRange(new Price(1.00), undefined)).toBe(true);
      expect(product.isInPriceRange(new Price(2.00), undefined)).toBe(false);
    });

    it('should handle price range with only maximum value', () => {
      const categories = [new Category('food')];
      const price = new Price(1.50);
      const product = new Product('1', 'Banana', price, categories, true);
      
      expect(product.isInPriceRange(undefined, new Price(2.00))).toBe(true);
      expect(product.isInPriceRange(undefined, new Price(1.00))).toBe(false);
    });
  });
}); 