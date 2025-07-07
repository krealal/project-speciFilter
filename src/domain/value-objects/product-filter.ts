import { Category } from './category.value-object';
import { Price } from './price.value-object';
import { Product } from '../entities/product.entity';
import { FilterCriterion, CategoryFilterCriterion, PriceFilterCriterion, StockFilterCriterion } from '../criteria/filter-criterion.interface';

export class ProductFilter {
  private readonly _categories: Category[];
  private readonly _minPrice?: Price;
  private readonly _maxPrice?: Price;
  private readonly _hasStock?: boolean;
  private readonly _criteria: FilterCriterion[];

  constructor(
    categories: Category[] = [],
    minPrice?: Price,
    maxPrice?: Price,
    hasStock?: boolean
  ) {
    if (minPrice && maxPrice && minPrice.greaterThan(maxPrice)) {
      throw new Error('Min price cannot be greater than max price');
    }

    this._categories = [...categories];
    this._minPrice = minPrice;
    this._maxPrice = maxPrice;
    this._hasStock = hasStock;

    this._criteria = this._buildCriteria();
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

  get hasStock(): boolean | undefined {
    return this._hasStock;
  }

  isEmpty(): boolean {
    return this._categories.length === 0 && !this._minPrice && !this._maxPrice && this._hasStock === undefined;
  }

  matches(product: Product): boolean {
    return this._criteria.every(criterion => criterion.matches(product));
  }

  private _buildCriteria(): FilterCriterion[] {
    const criteria: FilterCriterion[] = [];

    if (this._categories.length > 0) {
      criteria.push(new CategoryFilterCriterion(this._categories));
    }

    if (this._minPrice || this._maxPrice) {
      criteria.push(new PriceFilterCriterion(this._minPrice, this._maxPrice));
    }

    if (this._hasStock !== undefined) {
      criteria.push(new StockFilterCriterion(this._hasStock));
    }

    return criteria;
  }

  hasCategoryFilter(): boolean {
    return this._categories.length > 0;
  }

  hasPriceFilter(): boolean {
    return this._minPrice !== undefined || this._maxPrice !== undefined;
  }

  hasStockFilter(): boolean {
    return this._hasStock !== undefined;
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
  private _hasStock?: boolean;

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

  withStockFilter(hasStock: boolean): ProductFilterBuilder {
    this._hasStock = hasStock;
    return this;
  }

  withInStockOnly(): ProductFilterBuilder {
    this._hasStock = true;
    return this;
  }

  withOutOfStockOnly(): ProductFilterBuilder {
    this._hasStock = false;
    return this;
  }

  build(): ProductFilter {
    return new ProductFilter(this._categories, this._minPrice, this._maxPrice, this._hasStock);
  }
} 