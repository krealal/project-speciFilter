import { InMemoryProductRepository } from '../../../../src/infrastructure/repositories/in-memory-product-repository';
import { Product } from '../../../../src/domain/entities/product';
import { Category } from '../../../../src/domain/value-objects/category';
import { Price } from '../../../../src/domain/value-objects/price';
import { ProductFilter } from '../../../../src/domain/value-objects/product-filter';

describe('InMemoryProductRepository', () => {
  let repository: InMemoryProductRepository;
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
      )
    ];

    repository = new InMemoryProductRepository(sampleProducts);
  });

  describe('constructor', () => {
    it('should initialize with empty array when no products provided', () => {
      const emptyRepository = new InMemoryProductRepository();
      
      expect(emptyRepository).toBeDefined();
    });

    it('should initialize with provided products', () => {
      const repository = new InMemoryProductRepository(sampleProducts);
      
      expect(repository).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = await repository.findAll();
      
      expect(products).toHaveLength(3);
      expect(products).toEqual(sampleProducts);
    });

    it('should return empty array when no products', async () => {
      const emptyRepository = new InMemoryProductRepository([]);
      const products = await emptyRepository.findAll();
      
      expect(products).toHaveLength(0);
    });

    it('should return a copy of products array', async () => {
      const products = await repository.findAll();
      
      // Modifying returned array should not affect internal state
      products.push(new Product(
        '4',
        'Test Product',
        new Price(10.00),
        [new Category('food')],
        true
      ));
      
      const productsAgain = await repository.findAll();
      expect(productsAgain).toHaveLength(3);
    });
  });

  describe('findByFilter', () => {
    it('should return all products when filter is empty', async () => {
      const filter = new ProductFilter();
      const products = await repository.findByFilter(filter);
      
      expect(products).toHaveLength(3);
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
      
      expect(products).toHaveLength(1);
      expect(products[0].name).toBe('Banana');
    });

    it('should filter by min price only', async () => {
      const filter = new ProductFilter(
        [],
        new Price(1.00)
      );
      const products = await repository.findByFilter(filter);
      
      expect(products).toHaveLength(2);
      expect(products.every(p => p.price.greaterThanOrEqual(new Price(1.00)))).toBe(true);
    });

    it('should filter by max price only', async () => {
      const filter = new ProductFilter(
        [],
        undefined,
        new Price(10.00)
      );
      const products = await repository.findByFilter(filter);
      
      expect(products).toHaveLength(2);
      expect(products.every(p => p.price.lessThanOrEqual(new Price(10.00)))).toBe(true);
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

    it('should return empty array when price filter matches nothing', async () => {
      const filter = new ProductFilter(
        [],
        new Price(100.00),
        new Price(200.00)
      );
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

    it('should return null when id is empty', async () => {
      const product = await repository.findById('');
      
      expect(product).toBeNull();
    });
  });

  describe('save', () => {
    it('should add new product', async () => {
      const newProduct = new Product(
        '4',
        'Soap',
        new Price(3.50),
        [new Category('toiletries')],
        true
      );

      await repository.save(newProduct);
      const products = await repository.findAll();
      
      expect(products).toHaveLength(4);
      expect(products.find(p => p.id === '4')).toEqual(newProduct);
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
      expect(product?.categories).toHaveLength(2);
    });

    it('should maintain same number of products when updating', async () => {
      const updatedProduct = new Product(
        '1',
        'Green Apple',
        new Price(1.20),
        [new Category('food')],
        true
      );

      await repository.save(updatedProduct);
      const products = await repository.findAll();
      
      expect(products).toHaveLength(3);
    });
  });

  describe('delete', () => {
    it('should remove product', async () => {
      await repository.delete('1');
      const products = await repository.findAll();
      
      expect(products).toHaveLength(2);
      expect(products.find(p => p.id === '1')).toBeUndefined();
    });

    it('should not fail when deleting non-existent product', async () => {
      await expect(repository.delete('999')).resolves.not.toThrow();
      const products = await repository.findAll();
      
      expect(products).toHaveLength(3);
    });

    it('should not fail when deleting with empty id', async () => {
      await expect(repository.delete('')).resolves.not.toThrow();
      const products = await repository.findAll();
      
      expect(products).toHaveLength(3);
    });
  });

  describe('data persistence', () => {
    it('should maintain data across multiple operations', async () => {
      // Add a product
      const newProduct = new Product(
        '4',
        'Soap',
        new Price(3.50),
        [new Category('toiletries')],
        true
      );
      await repository.save(newProduct);
      
      // Update a product
      const updatedProduct = new Product(
        '1',
        'Green Apple',
        new Price(1.20),
        [new Category('food')],
        true
      );
      await repository.save(updatedProduct);
      
      // Delete a product
      await repository.delete('2');
      
      // Verify final state
      const products = await repository.findAll();
      expect(products).toHaveLength(3);
      expect(products.find(p => p.id === '1')?.name).toBe('Green Apple');
      expect(products.find(p => p.id === '2')).toBeUndefined();
      expect(products.find(p => p.id === '4')).toBeDefined();
    });
  });
}); 