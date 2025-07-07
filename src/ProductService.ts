import { Product } from './Product';
import { ProductFilter } from './ProductFilter';

export class ProductService {
  private products: Product[] = [];

  constructor(products: Product[] = []) {
    this.products = [...products];
  }

  filterProducts(filter: ProductFilter): Product[] {
    const filteredProducts = this.products.filter(product => filter.matches(product));
    return this.sortByStock(filteredProducts);
  }

  getAllProducts(): Product[] {
    return this.sortByStock([...this.products]);
  }

  getProductById(id: string): Product | null {
    return this.products.find(product => product.id === id) || null;
  }

  addProduct(product: Product): void {
    const existingIndex = this.products.findIndex(p => p.id === product.id);
    if (existingIndex >= 0) {
      this.products[existingIndex] = product;
    } else {
      this.products.push(product);
    }
  }

  removeProduct(id: string): void {
    this.products = this.products.filter(product => product.id !== id);
  }

  private sortByStock(products: Product[]): Product[] {
    return [...products].sort((a, b) => {
      if (a.hasStock === b.hasStock) {
        return 0;
      }
      return a.hasStock ? -1 : 1;
    });
  }
} 