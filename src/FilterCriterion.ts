import { Product } from './Product';

export interface FilterCriterion {
  matches(product: Product): boolean;
}

export class CategoryFilterCriterion implements FilterCriterion {
  constructor(private readonly categories: string[]) {}

  matches(product: Product): boolean {
    if (this.categories.length === 0) {
      return true;
    }
    return this.categories.some(category => product.hasCategory(category));
  }
}

export class PriceFilterCriterion implements FilterCriterion {
  constructor(
    private readonly minPrice?: number,
    private readonly maxPrice?: number
  ) {}

  matches(product: Product): boolean {
    return product.hasPriceInRange(this.minPrice, this.maxPrice);
  }
}

export class StockFilterCriterion implements FilterCriterion {
  constructor(private readonly hasStock: boolean) {}

  matches(product: Product): boolean {
    return product.hasStock === this.hasStock;
  }
} 