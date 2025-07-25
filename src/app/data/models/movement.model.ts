import {BaseModel} from './base.model';

export enum MovementType {
  Credit,
  Debit
}

export const translatedMovementType = {
  [MovementType.Debit]: 'Débito',
  [MovementType.Credit]: 'Crédito'
}

export interface Movement extends BaseModel{
  date: string
  type: MovementType
  value: number,
  balance: number
}
