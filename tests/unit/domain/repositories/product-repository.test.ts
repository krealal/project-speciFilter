import { Product } from '../../../../src/domain/entities/product';
import { ProductFilter } from '../../../../src/domain/value-objects/product-filter';
import { ProductRepository } from '../../../../src/domain/repositories/product-repository';
import { Category } from '../../../../src/domain/value-objects/category';
import { Price } from '../../../../src/domain/value-objects/price';

// Mock implementation para testing
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
      // Filter by categories
      if (filter.hasCategoryFilter()) {
        const hasMatchingCategory = product.categories.some(category =>
          filter.matchesCategory(category)
        );
        if (!hasMatchingCategory) {
          return false;
        }
      }

      // Filter by price range
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

describe('ProductRepository Interface', () => {
  let repository: ProductRepository;
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
      )
    ];

    repository = new MockProductRepository(sampleProducts);
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = await repository.findAll();
      
      expect(products).toHaveLength(4);
      expect(products).toEqual(sampleProducts);
    });

    it('should return empty array when no products', async () => {
      const emptyRepository = new MockProductRepository([]);
      const products = await emptyRepository.findAll();
      
      expect(products).toHaveLength(0);
    });
  });

  describe('findByFilter', () => {
    it('should return all products when filter is empty', async () => {
      const filter = new ProductFilter();
      const products = await repository.findByFilter(filter);
      
      expect(products).toHaveLength(4);
    });

    it('should filter by single category', async () => {
      const filter = new ProductFilter([new Category('food')]);
      const products = await repository.findByFilter(filter);
      
      expect(products).toHaveLength(2);
      expect(products.every(p => p.belongsToCategory(new Category('food')))).toBe(true);
    });

    it('should filter by multiple categories', async () => {
      const filter = new ProductFilter([
        new Category('food'),
        new Category('clothes')
      ]);
      const products = await repository.findByFilter(filter);
      
      expect(products).toHaveLength(3);
    });

    it('should filter by price range', async () => {
      const filter = new ProductFilter(
        [],
        new Price(1.00),
        new Price(10.00)
      );
      const products = await repository.findByFilter(filter);
      
      expect(products).toHaveLength(2);
      expect(products.every(p => 
        p.price.greaterThanOrEqual(new Price(1.00)) && 
        p.price.lessThanOrEqual(new Price(10.00))
      )).toBe(true);
    });

    it('should filter by category and price range', async () => {
      const filter = new ProductFilter(
        [new Category('food')],
        new Price(1.00),
        new Price(2.00)
      );
      const products = await repository.findByFilter(filter);
      
      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Banana');
    });

    it('should return empty array when no products match filter', async () => {
      const filter = new ProductFilter([new Category('limited-edition')]);
      const products = await repository.findByFilter(filter);
      
      expect(products).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should return product when found', async () => {
      const product = await repository.findById('1');
      
      expect(product).not.toBeNull();
      expect(product?.id).toBe('1');
      expect(product?.name).toBe('Apple');
    });

    it('should return null when product not found', async () => {
      const product = await repository.findById('999');
      
      expect(product).toBeNull();
    });
  });

  describe('save', () => {
    it('should add new product', async () => {
      const newProduct = new Product(
        '5',
        'Soap',
        new Price(3.50),
        [new Category('toiletries')],
        true
      );

      await repository.save(newProduct);
      const products = await repository.findAll();
      
      expect(products).toHaveLength(5);
      expect(products.find(p => p.id === '5')).toEqual(newProduct);
    });

    it('should update existing product', async () => {
      const updatedProduct = new Product(
        '1',
        'Green Apple',
        new Price(1.20),
        [new Category('food'), new Category('new')],
        true
      );

      await repository.save(updatedProduct);
      const product = await repository.findById('1');
      
      expect(product?.name).toBe('Green Apple');
      expect(product?.price.value).toBe(1.20);
    });
  });

  describe('delete', () => {
    it('should remove product', async () => {
      await repository.delete('1');
      const products = await repository.findAll();
      
      expect(products).toHaveLength(3);
      expect(products.find(p => p.id === '1')).toBeUndefined();
    });

    it('should not fail when deleting non-existent product', async () => {
      await expect(repository.delete('999')).resolves.not.toThrow();
      const products = await repository.findAll();
      
      expect(products).toHaveLength(4);
    });
  });
}); 