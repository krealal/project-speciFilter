import { Category } from './category';
import { Price } from './price';

export class ProductFilter {
  private readonly _categories: Category[];
  private readonly _minPrice?: Price;
  private readonly _maxPrice?: Price;

  constructor(
    categories: Category[] = [],
    minPrice?: Price,
    maxPrice?: Price
  ) {
    if (minPrice && maxPrice && minPrice.greaterThan(maxPrice)) {
      throw new Error('Min price cannot be greater than max price');
    }

    this._categories = [...categories];
    this._minPrice = minPrice;
    this._maxPrice = maxPrice;
  }

  get categories(): Category[] {
    return [...this._categories];
  }

  get minPrice(): Price | undefined {
    return this._minPrice;
  }

  get maxPrice(): Price | undefined {
    return this._maxPrice;
  }

  isEmpty(): boolean {
    return this._categories.length === 0 && !this._minPrice && !this._maxPrice;
  }

  hasCategoryFilter(): boolean {
    return this._categories.length > 0;
  }

  hasPriceFilter(): boolean {
    return this._minPrice !== undefined || this._maxPrice !== undefined;
  }

  matchesCategory(category: Category): boolean {
    if (!this.hasCategoryFilter()) {
      return true;
    }

    return this._categories.some(filterCategory => filterCategory.equals(category));
  }

  matchesPrice(price: Price): boolean {
    if (!this.hasPriceFilter()) {
      return true;
    }

    if (this._minPrice && price.lessThan(this._minPrice)) {
      return false;
    }

    if (this._maxPrice && price.greaterThan(this._maxPrice)) {
      return false;
    }

    return true;
  }

  static builder(): ProductFilterBuilder {
    return new ProductFilterBuilder();
  }
}

export class ProductFilterBuilder {
  private _categories: Category[] = [];
  private _minPrice?: Price;
  private _maxPrice?: Price;

  withCategories(categories: Category[]): ProductFilterBuilder {
    this._categories = [...categories];
    return this;
  }

  withMinPrice(minPrice: Price): ProductFilterBuilder {
    this._minPrice = minPrice;
    return this;
  }

  withMaxPrice(maxPrice: Price): ProductFilterBuilder {
    this._maxPrice = maxPrice;
    return this;
  }

  withPriceRange(minPrice: Price, maxPrice: Price): ProductFilterBuilder {
    this._minPrice = minPrice;
    this._maxPrice = maxPrice;
    return this;
  }

  build(): ProductFilter {
    return new ProductFilter(this._categories, this._minPrice, this._maxPrice);
  }
} 