import {BaseService} from './base.service';
import {Account} from '../models/account.model';
import {Movement} from '../models/movement.model';

export class MovementsService extends BaseService<Movement>{
  controller = 'movement';
}
