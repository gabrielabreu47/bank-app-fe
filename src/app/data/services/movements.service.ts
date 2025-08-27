import {BaseService} from './base.service';
import {Movement} from '../models/movement.model';

export class MovementsService extends BaseService<Movement>{
  controller = 'movement';
}
