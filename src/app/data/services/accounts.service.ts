import {BaseService} from './base.service';
import {Account} from '../models/account.model';
import {Reports} from '../../features/reports/pages/reports/reports';
import {Report} from '../models/report.model';

export class AccountsService extends BaseService<Account>{
  controller = 'account';

  getReports(accountId: string, from?: string, to?: string){
    return this.read<Report>('report', {
      accountId,
      ...(from && {from}),
      ...(to && {to}),
    })
  }
}
