import { ProductRepository } from '../../domain/repositories/product-repository';
import { Product } from '../../domain/entities/product';
import { ProductFilter } from '../../domain/value-objects/product-filter';

export class ProductFilterService {
  constructor(private readonly productRepository: ProductRepository) {}

  /**
   * Filtra productos según los criterios especificados y los ordena con productos con stock primero
   */
  async filterProducts(filter: ProductFilter): Promise<Product[]> {
    const products = await this.productRepository.findByFilter(filter);
    return this.sortByStock(products);
  }

  /**
   * Obtiene todos los productos ordenados con productos con stock primero
   */
  async getAllProducts(): Promise<Product[]> {
    const products = await this.productRepository.findAll();
    return this.sortByStock(products);
  }

  /**
   * Busca un producto por su ID
   */
  async getProductById(id: string): Promise<Product | null> {
    return await this.productRepository.findById(id);
  }

  /**
   * Ordena los productos colocando primero los que tienen stock
   */
  private sortByStock(products: Product[]): Product[] {
    return products.sort((a, b) => {
      // Si ambos tienen stock o ambos no tienen stock, mantener el orden original
      if (a.hasStock === b.hasStock) {
        return 0;
      }
      // Si 'a' tiene stock y 'b' no, 'a' va primero
      if (a.hasStock && !b.hasStock) {
        return -1;
      }
      // Si 'b' tiene stock y 'a' no, 'b' va primero
      return 1;
    });
  }
} 