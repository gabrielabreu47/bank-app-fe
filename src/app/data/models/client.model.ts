import {Person} from './person.model';

export interface Client extends Person{
  password: string
  status: boolean
}
