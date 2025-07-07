export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly categories: string[],
    public readonly hasStock: boolean
  ) {}

  hasCategory(category: string): boolean {
    return this.categories.includes(category);
  }

  hasPriceInRange(minPrice?: number, maxPrice?: number): boolean {
    if (minPrice !== undefined && this.price < minPrice) {
      return false;
    }
    if (maxPrice !== undefined && this.price > maxPrice) {
      return false;
    }
    return true;
  }
} 