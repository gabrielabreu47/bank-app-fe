import {Movement} from './movement.model';

export interface Report{
  "clientName": string
  "from": string,
  "to": string,
  "accountNumber": string,
  "status": boolean,
  "type": number,
  "balance": number,
  "movements": Movement[]
}
