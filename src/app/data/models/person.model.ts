import {Gender} from '../../common/enums/gender.enum';
import {BaseModel} from './base.model';

export interface Person extends BaseModel{
  name: string
  lastName: string
  gender: Gender
  birthDate: string
  identification: string
  address: string
  phone: string
}
