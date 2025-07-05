export class Category {
  private static readonly VALID_CATEGORIES = [
    'food',
    'clothes',
    'toiletries',
    'free-shipping',
    'new',
    'offer',
    'limited-edition'
  ] as const;

  private readonly _value: string;

  constructor(value: string) {
    if (!value || value.trim() === '') {
      throw new Error('Category cannot be empty');
    }

    if (!Category.isValid(value)) {
      throw new Error(`Invalid category: ${value}`);
    }

    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  equals(other: Category | null | undefined): boolean {
    if (!other) {
      return false;
    }

    return this._value === other._value;
  }

  static getValidCategories(): readonly string[] {
    return Category.VALID_CATEGORIES;
  }

  static isValid(value: string | null | undefined): boolean {
    if (!value || value.trim() === '') {
      return false;
    }

    return Category.VALID_CATEGORIES.includes(value as any);
  }
} 