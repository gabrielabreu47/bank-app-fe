import {BaseModel} from './base.model';

export enum AccountType {
  Checkings,
  Savings,
}

export const translatedAccountType = {
  [AccountType.Checkings]: 'Corriente',
  [AccountType.Savings]: 'Ahorros'
}

export interface Account extends BaseModel{
  accountNumber: string
  type: AccountType
  balance: number
  status: boolean
}
