import { Product } from './Product';
import { 
  FilterCriterion, 
  CategoryFilterCriterion, 
  PriceFilterCriterion, 
  StockFilterCriterion 
} from './FilterCriterion';

export class ProductFilter {
  private readonly criteria: FilterCriterion[] = [];

  constructor(
    categories: string[] = [],
    minPrice?: number,
    maxPrice?: number,
    hasStock?: boolean
  ) {
    if (categories.length > 0) {
      this.criteria.push(new CategoryFilterCriterion(categories));
    }
    
    if (minPrice !== undefined || maxPrice !== undefined) {
      this.criteria.push(new PriceFilterCriterion(minPrice, maxPrice));
    }
    
    if (hasStock !== undefined) {
      this.criteria.push(new StockFilterCriterion(hasStock));
    }
  }

  matches(product: Product): boolean {
    return this.criteria.every(criterion => criterion.matches(product));
  }

  isEmpty(): boolean {
    return this.criteria.length === 0;
  }

  static builder(): ProductFilterBuilder {
    return new ProductFilterBuilder();
  }
}

export class ProductFilterBuilder {
  private categories: string[] = [];
  private minPrice?: number;
  private maxPrice?: number;
  private hasStock?: boolean;

  withCategories(categories: string[]): ProductFilterBuilder {
    this.categories = [...categories];
    return this;
  }

  withCategory(category: string): ProductFilterBuilder {
    this.categories.push(category);
    return this;
  }

  withMinPrice(minPrice: number): ProductFilterBuilder {
    this.minPrice = minPrice;
    return this;
  }

  withMaxPrice(maxPrice: number): ProductFilterBuilder {
    this.maxPrice = maxPrice;
    return this;
  }

  withPriceRange(minPrice: number, maxPrice: number): ProductFilterBuilder {
    this.minPrice = minPrice;
    this.maxPrice = maxPrice;
    return this;
  }

  withStockFilter(hasStock: boolean): ProductFilterBuilder {
    this.hasStock = hasStock;
    return this;
  }

  withInStockOnly(): ProductFilterBuilder {
    this.hasStock = true;
    return this;
  }

  withOutOfStockOnly(): ProductFilterBuilder {
    this.hasStock = false;
    return this;
  }

  build(): ProductFilter {
    return new ProductFilter(this.categories, this.minPrice, this.maxPrice, this.hasStock);
  }
} 