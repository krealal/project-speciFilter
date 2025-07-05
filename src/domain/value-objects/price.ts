export class Price {
  private readonly _value: number;

  constructor(value: number) {
    if (value == null || typeof value !== 'number' || isNaN(value) || !isFinite(value)) {
      throw new Error('Price must be a valid number');
    }

    if (value < 0) {
      throw new Error('Price cannot be negative');
    }

    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  equals(other: Price | null | undefined): boolean {
    if (!other) {
      return false;
    }

    return this._value === other._value;
  }

  greaterThan(other: Price): boolean {
    return this._value > other._value;
  }

  greaterThanOrEqual(other: Price): boolean {
    return this._value >= other._value;
  }

  lessThan(other: Price): boolean {
    return this._value < other._value;
  }

  lessThanOrEqual(other: Price): boolean {
    return this._value <= other._value;
  }

  toString(): string {
    return this._value.toString();
  }

  toFixed(digits: number): string {
    return this._value.toFixed(digits);
  }
} 