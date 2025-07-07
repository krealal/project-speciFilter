import { ProductService } from '../src/ProductService';
import { Product } from '../src/Product';
import { ProductFilter } from '../src/ProductFilter';

describe('ProductService Tests', () => {
  let productService: ProductService;
  const testProducts = [
    new Product('1', 'Apple', 0.99, ['food', 'free-shipping'], true),
    new Product('2', 'Banana', 1.50, ['food'], false),
    new Product('3', 'T-Shirt', 15.99, ['clothes', 'new'], true),
    new Product('4', 'Shampoo', 8.50, ['toiletries', 'offer'], true),
    new Product('5', 'Limited Watch', 299.99, ['limited-edition'], false)
  ];

  beforeEach(() => {
    productService = new ProductService([...testProducts]);
  });

  describe('Basic Operations', () => {
    it('should initialize with provided products', () => {
      const products = productService.getAllProducts();
      expect(products).toHaveLength(5);
    });

    it('should sort products by stock (in-stock first)', () => {
      const products = productService.getAllProducts();
      
      // First three should be in stock
      expect(products[0].hasStock).toBe(true);
      expect(products[1].hasStock).toBe(true);
      expect(products[2].hasStock).toBe(true);
      
      // Last two should be out of stock
      expect(products[3].hasStock).toBe(false);
      expect(products[4].hasStock).toBe(false);
    });

    it('should find product by ID', () => {
      const product = productService.getProductById('1');
      expect(product).toBeDefined();
      expect(product?.name).toBe('Apple');
    });

    it('should return null for non-existent product ID', () => {
      const product = productService.getProductById('999');
      expect(product).toBeNull();
    });
  });

  describe('Filter Operations', () => {
    it('should filter products by category', () => {
      const filter = new ProductFilter(['food']);
      const results = productService.filterProducts(filter);
      
      expect(results).toHaveLength(2);
      expect(results.every(p => p.categories.includes('food'))).toBe(true);
    });

    it('should filter products by price range', () => {
      const filter = new ProductFilter([], 1.00, 10.00);
      const results = productService.filterProducts(filter);
      
      expect(results).toHaveLength(2);
      expect(results.every(p => p.price >= 1.00 && p.price <= 10.00)).toBe(true);
    });

    it('should filter products by stock status', () => {
      const filter = new ProductFilter([], undefined, undefined, true);
      const results = productService.filterProducts(filter);
      
      expect(results).toHaveLength(3);
      expect(results.every(p => p.hasStock)).toBe(true);
    });

    it('should handle empty filter (return all products)', () => {
      const filter = new ProductFilter();
      const results = productService.filterProducts(filter);
      
      expect(results).toHaveLength(5);
    });

    it('should handle complex filter combinations', () => {
      const filter = new ProductFilter(['food'], undefined, 2.00, true);
      const results = productService.filterProducts(filter);
      
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Apple');
    });

    it('should return empty array when no products match', () => {
      const filter = new ProductFilter(['electronics']);
      const results = productService.filterProducts(filter);
      
      expect(results).toHaveLength(0);
    });

    it('should maintain stock sorting in filtered results', () => {
      const filter = new ProductFilter(['food', 'clothes']);
      const results = productService.filterProducts(filter);
      
      // Should have in-stock products first
      const inStockCount = results.filter(p => p.hasStock).length;
      const outOfStockCount = results.filter(p => !p.hasStock).length;
      
      // Check that all in-stock come before out-of-stock
      for (let i = 0; i < inStockCount; i++) {
        expect(results[i].hasStock).toBe(true);
      }
      for (let i = inStockCount; i < results.length; i++) {
        expect(results[i].hasStock).toBe(false);
      }
    });
  });

  describe('Product Management', () => {
    it('should add new product', () => {
      const newProduct = new Product('6', 'New Product', 5.99, ['test'], true);
      productService.addProduct(newProduct);
      
      const products = productService.getAllProducts();
      expect(products).toHaveLength(6);
      
      const addedProduct = productService.getProductById('6');
      expect(addedProduct).toBeDefined();
      expect(addedProduct?.name).toBe('New Product');
    });

    it('should update existing product when adding with same ID', () => {
      const updatedProduct = new Product('1', 'Updated Apple', 1.99, ['food'], false);
      productService.addProduct(updatedProduct);
      
      const products = productService.getAllProducts();
      expect(products).toHaveLength(5); // Same length, product was updated
      
      const retrievedProduct = productService.getProductById('1');
      expect(retrievedProduct?.name).toBe('Updated Apple');
      expect(retrievedProduct?.price).toBe(1.99);
      expect(retrievedProduct?.hasStock).toBe(false);
    });

    it('should remove product by ID', () => {
      productService.removeProduct('1');
      
      const products = productService.getAllProducts();
      expect(products).toHaveLength(4);
      
      const removedProduct = productService.getProductById('1');
      expect(removedProduct).toBeNull();
    });

    it('should handle removal of non-existent product gracefully', () => {
      productService.removeProduct('999');
      
      const products = productService.getAllProducts();
      expect(products).toHaveLength(5); // No change
    });
  });

  describe('Integration with Builder Pattern', () => {
    it('should work with filters created using Builder pattern', () => {
      const filter = ProductFilter.builder()
        .withCategories(['food', 'clothes'])
        .withMaxPrice(20.00)
        .withInStockOnly()
        .build();
      
      const results = productService.filterProducts(filter);
      
      expect(results).toHaveLength(2);
      expect(results.every(p => p.hasStock)).toBe(true);
      expect(results.every(p => p.price <= 20.00)).toBe(true);
      expect(results.every(p => 
        p.categories.includes('food') || p.categories.includes('clothes')
      )).toBe(true);
    });

    it('should handle complex Builder patterns', () => {
      const filter = ProductFilter.builder()
        .withCategory('food')
        .withCategory('clothes')
        .withPriceRange(0.50, 50.00)
        .withInStockOnly()
        .build();
      
      const results = productService.filterProducts(filter);
      
      expect(results).toHaveLength(2);
      expect(results.some(p => p.name === 'Apple')).toBe(true);
      expect(results.some(p => p.name === 'T-Shirt')).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty product list', () => {
      const emptyService = new ProductService([]);
      const results = emptyService.getAllProducts();
      
      expect(results).toHaveLength(0);
    });

    it('should handle filters on empty product list', () => {
      const emptyService = new ProductService([]);
      const filter = new ProductFilter(['food']);
      const results = emptyService.filterProducts(filter);
      
      expect(results).toHaveLength(0);
    });

    it('should maintain immutability of original products array', () => {
      const originalProducts = [...testProducts];
      const products = productService.getAllProducts();
      
      // Modify returned array
      products.push(new Product('999', 'Test', 1, ['test'], true));
      
      // Original should be unchanged
      const productsAgain = productService.getAllProducts();
      expect(productsAgain).toHaveLength(5);
      expect(originalProducts).toHaveLength(5);
    });
  });
}); 