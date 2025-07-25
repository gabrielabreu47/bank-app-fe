import {Component, inject, Input, OnInit} from '@angular/core';
import {BaseList} from '../../../../common/components/base-list/base-list';
import {MovementsService} from '../../../../data/services/movements.service';
import {Movement, MovementType} from '../../../../data/models/movement.model';
import {BaseListColumn} from '../../../../common/interfaces/base-list-column';
import {Account} from '../../../../data/models/account.model';
import {AccountsService} from '../../../../data/services/accounts.service';
import {ClientsService} from '../../../../data/services/clients.service';
import {Client} from '../../../../data/models/client.model';

@Component({
  selector: 'app-movements',
  imports: [
    BaseList,
  ],
  providers: [MovementsService, AccountsService, ClientsService],
  templateUrl: './movements.html',
  styleUrl: './movements.scss'
})
export class Movements implements OnInit{
  @Input() account!: Account

  private readonly movementsService = inject(MovementsService)

  movements: (Omit<Movement, 'type'> & {type: string})[] = []
  client?: Client
  filterBy = 'value'
  currentPage = 1
  pageSize = 10
  totalPages = 0
  loading = true
  searchFilter = ''

  columns: BaseListColumn[] = [
    {
      label: 'Fecha',
      value: 'date',
      type: 'date'
    },
    {
      label: 'Tipo',
      value: 'type'
    },
    {
      label: 'Valor',
      value: 'value',
      type: 'number'
    },
    {
      label: 'Saldo anterior',
      value: 'balance',
      type: 'number'
    },
  ]

  async ngOnInit() {
    await this.getMovements()
  }

  async getMovements(){
    const result = await this.movementsService.readPaginated({currentPage: this.currentPage, pageSize: this.pageSize}, `account/${this.account?.id}`, this.searchFilter ? `value=${this.searchFilter}` : '' )

    this.movements = result.result.items.map((m)=>({
      ...m,
      type: m.type === MovementType.Debit ? 'Débito' : 'Crédito'
    }))
    this.totalPages = result.result.totalPages
    this.loading = false
  }

  handleSearchFilterChange() {
    this.currentPage = 1
    this.getMovements()
  }
}
