import { Category } from '../value-objects/category';
import { Price } from '../value-objects/price';

export class Product {
  private readonly _id: string;
  private readonly _name: string;
  private readonly _price: Price;
  private readonly _categories: Category[];
  private readonly _hasStock: boolean;

  constructor(
    id: string,
    name: string,
    price: Price,
    categories: Category[],
    hasStock: boolean
  ) {
    if (!id || id.trim() === '') {
      throw new Error('Product id cannot be empty');
    }

    if (!name || name.trim() === '') {
      throw new Error('Product name cannot be empty');
    }

    if (!categories || categories.length === 0) {
      throw new Error('Product must have at least one category');
    }

    this._id = id;
    this._name = name;
    this._price = price;
    this._categories = [...categories];
    this._hasStock = hasStock;
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): Price {
    return this._price;
  }

  get categories(): Category[] {
    return [...this._categories];
  }

  get hasStock(): boolean {
    return this._hasStock;
  }

  belongsToCategory(category: Category): boolean {
    return this._categories.some(productCategory => productCategory.equals(category));
  }

  isInPriceRange(minPrice?: Price, maxPrice?: Price): boolean {
    if (minPrice && this._price.lessThan(minPrice)) {
      return false;
    }

    if (maxPrice && this._price.greaterThan(maxPrice)) {
      return false;
    }

    return true;
  }
} 