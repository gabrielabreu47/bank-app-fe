import {Component, inject, Input, OnInit} from '@angular/core';
import {BaseList} from '../../../../common/components/base-list/base-list';
import {AccountsService} from '../../../../data/services/accounts.service';
import {Account, translatedAccountType} from '../../../../data/models/account.model';
import {BaseListColumn} from '../../../../common/interfaces/base-list-column';
import {Client} from '../../../../data/models/client.model';

@Component({
  selector: 'app-accounts',
  imports: [
    BaseList,
  ],
  providers: [AccountsService],
  templateUrl: './accounts.html',
  styleUrl: './accounts.scss'
})
export class Accounts implements OnInit{
  @Input() client!: Client
  private readonly accountsService = inject(AccountsService)

  accounts: (Omit<Account, 'type'> & {type: string})[] = []
  filterBy = 'number'
  currentPage = 1
  pageSize = 10
  totalPages = 0
  loading = true

  searchFilter = '';

  columns: BaseListColumn[] = [
    {
      label: 'Número de cuenta',
      value: 'accountNumber'
    },
    {
      label: 'Tipo',
      value: 'type'
    },
    {
      label: 'Balance',
      value: 'balance',
      type: 'number'
    },
    {
      label: 'Estado',
      value: 'status'
    },
  ]

  async ngOnInit() {
    await this.getAccounts()
  }

  async getAccounts(){
    if(!this.client){
      return
    }

    this.loading = true

    const result = await this.accountsService.readPaginated({currentPage: this.currentPage, pageSize: this.pageSize}, `client/${this.client?.id}`, this.searchFilter ? `accountNumber=${this.searchFilter}` : '')

    this.accounts = result.result.items.map((a)=>({
      ...a,
      type: translatedAccountType[a.type]
    }))
    this.totalPages = result.result.totalPages

    this.loading = false
  }

  handleSearchFilterChange() {
    this.currentPage = 1
    this.getAccounts()
  }
}
