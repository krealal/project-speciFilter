import { Product } from '../entities/product';
import { ProductFilter } from '../value-objects/product-filter';

export interface ProductRepository {
  /**
   * Obtiene todos los productos
   */
  findAll(): Promise<Product[]>;

  /**
   * Busca productos que coincidan con el filtro especificado
   */
  findByFilter(filter: ProductFilter): Promise<Product[]>;

  /**
   * Busca un producto por su ID
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Guarda un producto (crear o actualizar)
   */
  save(product: Product): Promise<void>;

  /**
   * Elimina un producto por su ID
   */
  delete(id: string): Promise<void>;
} 