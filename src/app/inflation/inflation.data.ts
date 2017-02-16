import { Map, OrderedMap } from 'immutable';

export class InflationData {

  private cachedMean: number|null;
  private cachedStandardDeviation: number|null;
  private cachedAdjustedValues = Map<string, OrderedMap<number,number>>();

  constructor(
    public readonly countryCode: string,
    public readonly countryName: string,
    public readonly data: OrderedMap<number, number>
  ) {
  }

  isEmpty(): boolean {
    return this.data.isEmpty();
  }

  startYear(): number {
    if (this.isEmpty()) {
      throw new Error('No start year on empty country data');
    }
    return this.data.keySeq().first();
  }

  endYear(): number {
    if (this.isEmpty()) {
      throw new Error('No end year on empty country data');
    }
    return this.data.keySeq().last();
  }

  mean(): number {
    if (this.cachedMean != null) {
      return this.cachedMean;
    }

    const sum = this.data.reduce((carry, inflation) => carry + inflation, 0);

    this.cachedMean = sum / this.data.count();

    return this.cachedMean;
  }

  public standardDeviation(): number {
    if (this.cachedStandardDeviation != null) {
      return this.cachedStandardDeviation;
    }

    const mean = this.mean();
    const squareDiffs = this.data.map(value => Math.pow(value - mean, 2));
    const squareDiffsSum = squareDiffs.reduce((sum, diff) => sum + diff, 0);

    this.cachedStandardDeviation = squareDiffsSum / this.data.count();
    return this.cachedStandardDeviation;
  }

  public inflation(year: number): number|null {
    return this.data.get(year, null);
  }

  public adjustedValue(year: number, amount: number): OrderedMap<number, number> {
    const key = `${year}_${amount}`;

    if (this.cachedAdjustedValues.has(key)) {
      return this.cachedAdjustedValues.get(key);
    }

    let unitValue = OrderedMap<number,number>();
    this.data.forEach((inflation, year) => {
      if (unitValue.isEmpty()) {
        unitValue = unitValue.set(year, 1);
        return;
      }
      unitValue = unitValue.set(year, unitValue.get(year - 1) * (100 + this.data.get(year - 1)) / 100);
    });

    const ratio = unitValue.has(year) ? 1 / unitValue.get(year) : 1;
    let result = OrderedMap<number, number>(unitValue.map(value => amount * value * ratio));

    // We can add the value for a year after the end of the data by adding the additional last year inflated value.
    const lastYear = result.keySeq().last();
    result = result.set(lastYear + 1, result.get(lastYear) * (100 + this.data.get(lastYear, 0)) / 100);

    this.cachedAdjustedValues = this.cachedAdjustedValues.set(key, result);

    return result;
  }
}
