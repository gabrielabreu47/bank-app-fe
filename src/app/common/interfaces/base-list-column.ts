import {LabelValue} from './label-value';
import {ColumnType} from '../types/column-type';

export interface BaseListColumn extends LabelValue {
  type?: ColumnType
}
