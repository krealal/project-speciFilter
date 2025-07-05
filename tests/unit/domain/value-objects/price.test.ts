import { Price } from '../../../../src/domain/value-objects/price';

describe('Price Value Object', () => {
  describe('creation', () => {
    it('should create a valid price', () => {
      const price = new Price(0.99);
      
      expect(price.value).toBe(0.99);
    });

    it('should create a price with zero value', () => {
      const price = new Price(0);
      
      expect(price.value).toBe(0);
    });

    it('should create a price with integer value', () => {
      const price = new Price(10);
      
      expect(price.value).toBe(10);
    });

    it('should create a price with decimal value', () => {
      const price = new Price(15.99);
      
      expect(price.value).toBe(15.99);
    });

    it('should throw error for negative price', () => {
      expect(() => {
        new Price(-1);
      }).toThrow('Price cannot be negative');
    });

    it('should throw error for null price', () => {
      expect(() => {
        new Price(null as any);
      }).toThrow('Price must be a valid number');
    });

    it('should throw error for undefined price', () => {
      expect(() => {
        new Price(undefined as any);
      }).toThrow('Price must be a valid number');
    });

    it('should throw error for NaN price', () => {
      expect(() => {
        new Price(NaN);
      }).toThrow('Price must be a valid number');
    });

    it('should throw error for infinite price', () => {
      expect(() => {
        new Price(Infinity);
      }).toThrow('Price must be a valid number');
    });
  });

  describe('comparison', () => {
    it('should be equal to another price with same value', () => {
      const price1 = new Price(0.99);
      const price2 = new Price(0.99);
      
      expect(price1.equals(price2)).toBe(true);
    });

    it('should not be equal to another price with different value', () => {
      const price1 = new Price(0.99);
      const price2 = new Price(1.50);
      
      expect(price1.equals(price2)).toBe(false);
    });

    it('should not be equal to null', () => {
      const price = new Price(0.99);
      
      expect(price.equals(null)).toBe(false);
    });

    it('should not be equal to undefined', () => {
      const price = new Price(0.99);
      
      expect(price.equals(undefined)).toBe(false);
    });

    it('should compare greater than', () => {
      const price1 = new Price(1.50);
      const price2 = new Price(0.99);
      
      expect(price1.greaterThan(price2)).toBe(true);
      expect(price2.greaterThan(price1)).toBe(false);
    });

    it('should compare greater than or equal', () => {
      const price1 = new Price(1.50);
      const price2 = new Price(0.99);
      const price3 = new Price(1.50);
      
      expect(price1.greaterThanOrEqual(price2)).toBe(true);
      expect(price1.greaterThanOrEqual(price3)).toBe(true);
      expect(price2.greaterThanOrEqual(price1)).toBe(false);
    });

    it('should compare less than', () => {
      const price1 = new Price(0.99);
      const price2 = new Price(1.50);
      
      expect(price1.lessThan(price2)).toBe(true);
      expect(price2.lessThan(price1)).toBe(false);
    });

    it('should compare less than or equal', () => {
      const price1 = new Price(0.99);
      const price2 = new Price(1.50);
      const price3 = new Price(0.99);
      
      expect(price1.lessThanOrEqual(price2)).toBe(true);
      expect(price1.lessThanOrEqual(price3)).toBe(true);
      expect(price2.lessThanOrEqual(price1)).toBe(false);
    });
  });

  describe('formatting', () => {
    it('should format price as string', () => {
      const price = new Price(0.99);
      
      expect(price.toString()).toBe('0.99');
    });

    it('should format price with two decimal places', () => {
      const price = new Price(10);
      
      expect(price.toFixed(2)).toBe('10.00');
    });

    it('should format price with custom decimal places', () => {
      const price = new Price(15.999);
      
      expect(price.toFixed(2)).toBe('16.00');
      expect(price.toFixed(1)).toBe('16.0');
    });
  });
}); 