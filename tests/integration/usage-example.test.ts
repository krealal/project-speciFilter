import { ProductFilterService } from '../../src/application/use-cases/product-filter-service';
import { InMemoryProductRepository } from '../../src/infrastructure/repositories/in-memory-product-repository';
import { Product } from '../../src/domain/entities/product';
import { Category } from '../../src/domain/value-objects/category';
import { Price } from '../../src/domain/value-objects/price';
import { ProductFilter } from '../../src/domain/value-objects/product-filter';

describe('Usage Example - TheRefactorShop Product Filtering', () => {
  let productService: ProductFilterService;
  
  beforeAll(() => {
    const shopProducts = [
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
        'Cotton T-Shirt',
        new Price(15.99),
        [new Category('clothes'), new Category('new')],
        true
      ),
      new Product(
        '4',
        'Premium Shampoo',
        new Price(8.50),
        [new Category('toiletries'), new Category('offer')],
        true
      ),
      new Product(
        '5',
        'Limited Edition Watch',
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
      ),
      new Product(
        '7',
        'Organic Strawberries',
        new Price(3.25),
        [new Category('food'), new Category('new')],
        true
      ),
      new Product(
        '8',
        'Face Cream',
        new Price(25.00),
        [new Category('toiletries')],
        false
      )
    ];

    const repository = new InMemoryProductRepository(shopProducts);
    productService = new ProductFilterService(repository);
  });

  describe('Criterios de filtrado requeridos', () => {
    it('1. Usuario debe poder filtrar sólo por categoría', async () => {
      const foodFilter = new ProductFilter([new Category('food')]);
      const foodProducts = await productService.filterProducts(foodFilter);
      
      expect(foodProducts).toHaveLength(3);
      expect(foodProducts.every(p => p.belongsToCategory(new Category('food')))).toBe(true);
      
      expect(foodProducts[0].hasStock).toBe(true); // Apple
      expect(foodProducts[1].hasStock).toBe(true); // Organic Strawberries
      expect(foodProducts[2].hasStock).toBe(false); // Banana
    });

    it('1. Usuario debe poder filtrar sólo por rango de precio', async () => {
      const priceFilter = new ProductFilter(
        [],
        new Price(10.00),
        new Price(30.00)
      );
      const priceRangeProducts = await productService.filterProducts(priceFilter);
      
      expect(priceRangeProducts).toHaveLength(2);
      expect(priceRangeProducts.every(p => 
        p.price.greaterThanOrEqual(new Price(10.00)) && 
        p.price.lessThanOrEqual(new Price(30.00))
      )).toBe(true);
      
      expect(priceRangeProducts[0].hasStock).toBe(true); // Cotton T-Shirt
      expect(priceRangeProducts[1].hasStock).toBe(false); // Face Cream
    });

    it('1. Usuario debe poder combinar ambos criterios', async () => {
      const combinedFilter = new ProductFilter(
        [new Category('clothes')],
        new Price(50.00),
        new Price(100.00)
      );
      const combinedResults = await productService.filterProducts(combinedFilter);
      
      expect(combinedResults).toHaveLength(1);
      expect(combinedResults[0].name).toBe('Designer Jeans');
      expect(combinedResults[0].belongsToCategory(new Category('clothes'))).toBe(true);
      expect(combinedResults[0].price.value).toBe(89.99);
      expect(combinedResults[0].hasStock).toBe(true);
    });

    it('2. Filtro que no coincide con ningún producto devuelve lista vacía', async () => {
      const expensiveFoodFilter = new ProductFilter(
        [new Category('food')],
        new Price(100.00),
        new Price(200.00)
      );
      const noResults = await productService.filterProducts(expensiveFoodFilter);
      
      expect(noResults).toHaveLength(0);
    });

    it('3. Sin filtro muestra todos los productos', async () => {
      const noFilter = new ProductFilter();
      const allProducts = await productService.filterProducts(noFilter);
      
      expect(allProducts).toHaveLength(8);
      
      const productsWithStock = allProducts.filter(p => p.hasStock);
      const productsWithoutStock = allProducts.filter(p => !p.hasStock);
      
      expect(productsWithStock).toHaveLength(5);
      expect(productsWithoutStock).toHaveLength(3);
      
      const firstWithoutStockIndex = allProducts.findIndex(p => !p.hasStock);
      const lastWithStockIndex = allProducts.map(p => p.hasStock).lastIndexOf(true);
      
      expect(firstWithoutStockIndex).toBeGreaterThan(lastWithStockIndex);
    });
  });

  describe('Casos de uso del mundo real', () => {
    it('Cliente busca productos en oferta baratos', async () => {
      const cheapOffersFilter = new ProductFilter(
        [new Category('offer')],
        undefined,
        new Price(10.00)
      );
      const cheapOffers = await productService.filterProducts(cheapOffersFilter);
      
      expect(cheapOffers).toHaveLength(1);
      expect(cheapOffers[0].name).toBe('Premium Shampoo');
      expect(cheapOffers[0].belongsToCategory(new Category('offer'))).toBe(true);
      expect(cheapOffers[0].price.value).toBe(8.50);
      expect(cheapOffers[0].hasStock).toBe(true);
    });

    it('Cliente busca productos nuevos disponibles', async () => {
      const newProductsFilter = new ProductFilter([new Category('new')]);
      const newProducts = await productService.filterProducts(newProductsFilter);
      
      expect(newProducts).toHaveLength(2);
      expect(newProducts.every(p => p.belongsToCategory(new Category('new')))).toBe(true);
      expect(newProducts.every(p => p.hasStock)).toBe(true);
      
      const productNames = newProducts.map(p => p.name);
      expect(productNames).toContain('Cotton T-Shirt');
      expect(productNames).toContain('Organic Strawberries');
    });

    it('Cliente busca productos con envío gratis', async () => {
      const freeShippingFilter = new ProductFilter([new Category('free-shipping')]);
      const freeShippingProducts = await productService.filterProducts(freeShippingFilter);
      
      expect(freeShippingProducts).toHaveLength(1);
      expect(freeShippingProducts[0].name).toBe('Apple');
      expect(freeShippingProducts[0].belongsToCategory(new Category('free-shipping'))).toBe(true);
      expect(freeShippingProducts[0].hasStock).toBe(true);
    });

    it('Cliente busca productos de edición limitada (coleccionables)', async () => {
      const limitedEditionFilter = new ProductFilter([new Category('limited-edition')]);
      const limitedProducts = await productService.filterProducts(limitedEditionFilter);
      
      expect(limitedProducts).toHaveLength(1);
      expect(limitedProducts[0].name).toBe('Limited Edition Watch');
      expect(limitedProducts[0].belongsToCategory(new Category('limited-edition'))).toBe(true);
      expect(limitedProducts[0].hasStock).toBe(false); // Agotado, como es típico en ediciones limitadas
    });
  });

  describe('Validación de categorías según enunciado', () => {
    it('debe soportar todas las categorías especificadas', async () => {
      const validCategories = [
        'food',
        'clothes', 
        'toiletries',
        'free-shipping',
        'new',
        'offer',
        'limited-edition'
      ];

      for (const categoryValue of validCategories) {
        const filter = new ProductFilter([new Category(categoryValue)]);
        const results = await productService.filterProducts(filter);
        
        expect(results).toBeDefined();
        expect(Array.isArray(results)).toBe(true);
        
        if (results.length > 0) {
          expect(results.every(p => p.belongsToCategory(new Category(categoryValue)))).toBe(true);
        }
      }
    });
  });

  describe('Demostración de arquitectura DDD', () => {
    it('debe separar claramente las responsabilidades por capas', async () => {
      expect(() => new Category('invalid-category')).toThrow();
      expect(() => new Price(-1)).toThrow();
      
      const product = new Product(
        '1',
        'Test Product',
        new Price(10.00),
        [new Category('food')],
        true
      );
      expect(product.belongsToCategory(new Category('food'))).toBe(true);
      expect(product.isInPriceRange(new Price(5.00), new Price(15.00))).toBe(true);
      
      const filter = new ProductFilter([new Category('food')]);
      const results = await productService.filterProducts(filter);
      
      expect(results).toBeDefined();
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('Preparación para funcionalidades futuras', () => {
    it('la arquitectura debe soportar fácilmente nuevas categorías', () => {
      const validCategories = Category.getValidCategories();
      expect(validCategories).toContain('food');
      expect(validCategories).toContain('clothes');
      expect(validCategories).toContain('toiletries');
      
      expect(Category.isValid('food')).toBe(true);
      expect(Category.isValid('hypothetical-new-category')).toBe(false);
    });

    it('debe soportar nuevos criterios de filtrado usando el patrón builder', () => {
      const complexFilter = ProductFilter.builder()
        .withCategories([new Category('clothes'), new Category('toiletries')])
        .withMinPrice(new Price(5.00))
        .withMaxPrice(new Price(50.00))
        .build();
      
      expect(complexFilter.hasCategoryFilter()).toBe(true);
      expect(complexFilter.hasPriceFilter()).toBe(true);
      expect(complexFilter.categories).toHaveLength(2);
    });
  });
}); 