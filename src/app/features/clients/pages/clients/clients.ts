import {Component, inject, OnInit} from '@angular/core';
import {BaseList} from '../../../../common/components/base-list/base-list';
import {ClientsService} from '../../../../data/services/clients.service';
import {Client} from '../../../../data/models/client.model';
import {translatedGender} from '../../../../common/enums/gender.enum';
import {BaseListColumn} from '../../../../common/interfaces/base-list-column';
import moment from 'moment';

@Component({
  selector: 'app-accounts',
  imports: [
    BaseList
  ],
  providers: [ClientsService],
  templateUrl: './clients.html',
  styleUrl: './clients.scss'
})
export class Clients implements OnInit{
  private readonly clientsService = inject(ClientsService)

  clients: (Omit<Client, 'gender'> & {age: number, gender: string})[] = []
  filterBy = 'name'

  currentPage = 1
  pageSize = 10
  totalPages = 0
  loading = true

  searchFilter = ''

  columns: BaseListColumn[] = [
    {
      label: 'Nombre',
      value: 'name'
    },
    {
      label: 'Apellido',
      value: 'lastName'
    },
    {
      label: 'Género',
      value: 'gender'
    },
    {
      label: 'Edad',
      value: 'age',
    },
    {
      label: 'Fecha de nacimiento',
      value: 'birthDate',
      type: 'date'
    },
    {
      label: 'Identificación',
      value: 'identification'
    },
    {
      label: 'Dirección',
      value: 'address'
    },
    {
      label: 'Teléfono',
      value: 'phone',
      type: 'phone'
    }
  ]

  async ngOnInit() {
    await this.getClients()
  }

  async getClients(){
    this.loading = true
    const r = await this.clientsService.readPaginated({currentPage: this.currentPage, pageSize: this.pageSize}, undefined, this.searchFilter ? `name=${this.searchFilter}|lastname=${this.searchFilter}|identification=${this.searchFilter}` : '')

    this.clients = r.result.items.map(c => ({
      ...c,
      age:  moment().diff(moment(c.birthDate, 'YYYY-MM-DD'), 'years'),
      gender: translatedGender[c.gender]
    }))
    this.totalPages = r.result.totalPages
    this.loading = false
  }

  handleSearchFilterChange() {
    this.currentPage = 1
    this.getClients()
  }
}
