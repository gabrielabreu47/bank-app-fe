import {BaseService} from './base.service';
import {Client} from '../models/client.model';

export class ClientsService extends BaseService<Client>{
  controller = 'client';
}
