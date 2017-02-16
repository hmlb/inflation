import { InflationData } from './inflation.data';
import { OrderedMap } from 'immutable';

export interface DataResult {
  country: string;
  year: number;
  amount: number;
  actualizedYear: number;
  data: InflationData;
  adjustedValues: OrderedMap<number, number>;
  actualizedAmount: number;
}
