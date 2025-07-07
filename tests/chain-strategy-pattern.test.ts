import { 
  FilterCriterion, 
  CategoryFilterCriterion, 
  PriceFilterCriterion, 
  StockFilterCriterion 
} from '../src/FilterCriterion';
import { Product } from '../src/Product';
import { ProductFilter } from '../src/ProductFilter';

describe('Chain/Strategy Pattern Tests', () => {
  const testProducts = [
    new Product('1', 'Apple', 0.99, ['food', 'free-shipping'], true),
    new Product('2', 'Banana', 1.50, ['food'], false),
    new Product('3', 'T-Shirt', 15.99, ['clothes', 'new'], true),
    new Product('4', 'Shampoo', 8.50, ['toiletries', 'offer'], true),
    new Product('5', 'Limited Watch', 299.99, ['limited-edition'], false)
  ];

  describe('Strategy Pattern - FilterCriterion implementations', () => {
    
    describe('CategoryFilterCriterion', () => {
      it('should match products with specified category', () => {
        const criterion = new CategoryFilterCriterion(['food']);
        
        expect(criterion.matches(testProducts[0])).toBe(true); // Apple
        expect(criterion.matches(testProducts[1])).toBe(true); // Banana
        expect(criterion.matches(testProducts[2])).toBe(false); // T-Shirt
      });

      it('should match products with any of multiple categories', () => {
        const criterion = new CategoryFilterCriterion(['food', 'clothes']);
        
        expect(criterion.matches(testProducts[0])).toBe(true); // Apple (food)
        expect(criterion.matches(testProducts[2])).toBe(true); // T-Shirt (clothes)
        expect(criterion.matches(testProducts[3])).toBe(false); // Shampoo (toiletries)
      });

      it('should match all products when no categories specified', () => {
        const criterion = new CategoryFilterCriterion([]);
        
        testProducts.forEach(product => {
          expect(criterion.matches(product)).toBe(true);
        });
      });
    });

    describe('PriceFilterCriterion', () => {
      it('should match products within price range', () => {
        const criterion = new PriceFilterCriterion(1.00, 10.00);
        
        expect(criterion.matches(testProducts[1])).toBe(true); // Banana (1.50)
        expect(criterion.matches(testProducts[3])).toBe(true); // Shampoo (8.50)
        expect(criterion.matches(testProducts[0])).toBe(false); // Apple (0.99)
        expect(criterion.matches(testProducts[2])).toBe(false); // T-Shirt (15.99)
      });

      it('should match products above minimum price only', () => {
        const criterion = new PriceFilterCriterion(10.00, undefined);
        
        expect(criterion.matches(testProducts[2])).toBe(true); // T-Shirt (15.99)
        expect(criterion.matches(testProducts[4])).toBe(true); // Limited Watch (299.99)
        expect(criterion.matches(testProducts[0])).toBe(false); // Apple (0.99)
        expect(criterion.matches(testProducts[3])).toBe(false); // Shampoo (8.50)
      });

      it('should match products below maximum price only', () => {
        const criterion = new PriceFilterCriterion(undefined, 10.00);
        
        expect(criterion.matches(testProducts[0])).toBe(true); // Apple (0.99)
        expect(criterion.matches(testProducts[1])).toBe(true); // Banana (1.50)
        expect(criterion.matches(testProducts[3])).toBe(true); // Shampoo (8.50)
        expect(criterion.matches(testProducts[2])).toBe(false); // T-Shirt (15.99)
      });

      it('should match all products when no price limits specified', () => {
        const criterion = new PriceFilterCriterion(undefined, undefined);
        
        testProducts.forEach(product => {
          expect(criterion.matches(product)).toBe(true);
        });
      });
    });

    describe('StockFilterCriterion', () => {
      it('should match only in-stock products when hasStock is true', () => {
        const criterion = new StockFilterCriterion(true);
        
        expect(criterion.matches(testProducts[0])).toBe(true); // Apple (in stock)
        expect(criterion.matches(testProducts[2])).toBe(true); // T-Shirt (in stock)
        expect(criterion.matches(testProducts[3])).toBe(true); // Shampoo (in stock)
        expect(criterion.matches(testProducts[1])).toBe(false); // Banana (out of stock)
        expect(criterion.matches(testProducts[4])).toBe(false); // Limited Watch (out of stock)
      });

      it('should match only out-of-stock products when hasStock is false', () => {
        const criterion = new StockFilterCriterion(false);
        
        expect(criterion.matches(testProducts[1])).toBe(true); // Banana (out of stock)
        expect(criterion.matches(testProducts[4])).toBe(true); // Limited Watch (out of stock)
        expect(criterion.matches(testProducts[0])).toBe(false); // Apple (in stock)
        expect(criterion.matches(testProducts[2])).toBe(false); // T-Shirt (in stock)
      });
    });
  });

  describe('Chain of Responsibility Pattern - Multiple criteria chaining', () => {
    
    it('should apply all criteria in chain and return true only when all match', () => {
      // Filter for food products, in stock, under €2.00
      const filter = new ProductFilter(['food'], undefined, 2.00, true);
      
      expect(filter.matches(testProducts[0])).toBe(true); // Apple: food, in stock, €0.99
      expect(filter.matches(testProducts[1])).toBe(false); // Banana: food, out of stock, €1.50
      expect(filter.matches(testProducts[2])).toBe(false); // T-Shirt: not food
    });

    it('should handle complex chains with multiple criteria', () => {
      // Filter for clothes or toiletries, in stock, between €5-€20
      const filter = new ProductFilter(['clothes', 'toiletries'], 5.00, 20.00, true);
      
      expect(filter.matches(testProducts[2])).toBe(true); // T-Shirt: clothes, in stock, €15.99
      expect(filter.matches(testProducts[3])).toBe(true); // Shampoo: toiletries, in stock, €8.50
      expect(filter.matches(testProducts[0])).toBe(false); // Apple: wrong category
      expect(filter.matches(testProducts[1])).toBe(false); // Banana: wrong category
      expect(filter.matches(testProducts[4])).toBe(false); // Limited Watch: out of stock + too expensive
    });

    it('should handle empty chain (no criteria)', () => {
      const filter = new ProductFilter();
      
      // Should match all products when no criteria are specified
      testProducts.forEach(product => {
        expect(filter.matches(product)).toBe(true);
      });
    });

    it('should short-circuit on first failing criterion', () => {
      // Create a filter with multiple criteria
      const filter = new ProductFilter(['food'], 50.00, undefined, true);
      
      // Even though Apple is food and in stock, it fails the price criterion
      expect(filter.matches(testProducts[0])).toBe(false);
    });
  });

  describe('Integration - Builder + Chain/Strategy patterns working together', () => {
    
    it('should create complex filters using Builder that work with Chain/Strategy', () => {
      const filter = ProductFilter.builder()
        .withCategories(['food', 'clothes'])
        .withMaxPrice(20.00)
        .withInStockOnly()
        .build();
      
      // Should match Apple (food, in stock, €0.99) and T-Shirt (clothes, in stock, €15.99)
      expect(filter.matches(testProducts[0])).toBe(true); // Apple
      expect(filter.matches(testProducts[2])).toBe(true); // T-Shirt
      expect(filter.matches(testProducts[1])).toBe(false); // Banana (out of stock)
      expect(filter.matches(testProducts[3])).toBe(false); // Shampoo (wrong category)
    });

    it('should demonstrate extensibility by adding new criteria', () => {
      // This test shows how easy it would be to add new criteria
      // without modifying existing code (Open/Closed Principle)
      
      class BrandFilterCriterion implements FilterCriterion {
        constructor(private brand: string) {}
        
        matches(product: Product): boolean {
          // In a real implementation, Product would have a brand property
          return product.name.includes(this.brand);
        }
      }
      
      const brandCriterion = new BrandFilterCriterion('Apple');
      expect(brandCriterion.matches(testProducts[0])).toBe(true);
      expect(brandCriterion.matches(testProducts[1])).toBe(false);
    });
  });
}); 