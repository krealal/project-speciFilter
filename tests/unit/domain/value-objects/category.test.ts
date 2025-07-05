import { Category } from '../../../../src/domain/value-objects/category';

describe('Category Value Object', () => {
  describe('creation', () => {
    it('should create a valid category', () => {
      const category = new Category('food');
      
      expect(category.value).toBe('food');
    });

    it('should create categories with all valid values', () => {
      const validCategories = [
        'food',
        'clothes',
        'toiletries',
        'free-shipping',
        'new',
        'offer',
        'limited-edition'
      ];

      validCategories.forEach(categoryValue => {
        const category = new Category(categoryValue);
        expect(category.value).toBe(categoryValue);
      });
    });

    it('should throw error for invalid category', () => {
      expect(() => {
        new Category('invalid-category');
      }).toThrow('Invalid category: invalid-category');
    });

    it('should throw error for empty category', () => {
      expect(() => {
        new Category('');
      }).toThrow('Category cannot be empty');
    });

    it('should throw error for null category', () => {
      expect(() => {
        new Category(null as any);
      }).toThrow('Category cannot be empty');
    });

    it('should throw error for undefined category', () => {
      expect(() => {
        new Category(undefined as any);
      }).toThrow('Category cannot be empty');
    });
  });

  describe('equality', () => {
    it('should be equal to another category with same value', () => {
      const category1 = new Category('food');
      const category2 = new Category('food');
      
      expect(category1.equals(category2)).toBe(true);
    });

    it('should not be equal to another category with different value', () => {
      const category1 = new Category('food');
      const category2 = new Category('clothes');
      
      expect(category1.equals(category2)).toBe(false);
    });

    it('should not be equal to null', () => {
      const category = new Category('food');
      
      expect(category.equals(null)).toBe(false);
    });

    it('should not be equal to undefined', () => {
      const category = new Category('food');
      
      expect(category.equals(undefined)).toBe(false);
    });
  });

  describe('static methods', () => {
    it('should get all valid categories', () => {
      const validCategories = Category.getValidCategories();
      
      expect(validCategories).toEqual([
        'food',
        'clothes',
        'toiletries',
        'free-shipping',
        'new',
        'offer',
        'limited-edition'
      ]);
    });

    it('should validate category correctly', () => {
      expect(Category.isValid('food')).toBe(true);
      expect(Category.isValid('invalid')).toBe(false);
      expect(Category.isValid('')).toBe(false);
      expect(Category.isValid(null as any)).toBe(false);
      expect(Category.isValid(undefined as any)).toBe(false);
    });
  });
}); 