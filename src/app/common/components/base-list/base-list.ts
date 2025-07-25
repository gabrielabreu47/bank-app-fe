import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {DatePipe, DecimalPipe} from '@angular/common';
import {BaseListColumn} from '../../interfaces/base-list-column';
import {NgxMaskPipe} from 'ngx-mask';

@Component({
  selector: 'app-base-list',
  imports: [
    FormsModule,
    DatePipe,
    NgxMaskPipe,
    DecimalPipe
  ],
  templateUrl: './base-list.html',
  styleUrl: './base-list.scss'
})
export class BaseList {
  private readonly router = inject(Router)
  private readonly route = inject(ActivatedRoute)

  @Input({required: true}) columns: BaseListColumn[] = []
  @Input({required: true}) filterBy!: string;
  @Input() totalPages = 0;
  @Input() loading = true;
  @Input() tableId? : string;

  @Input() hasDetails = true
  @Input() canCreate = true
  @Input() canSearch = true
  @Input() createRoute?: string
  @Input() detailsRoute?: string

  @Input({required: true}) title!: string;

  @Input({required: true}) items: any[] = []

  @Input() currentPage = 1
  @Output() currentPageChange = new EventEmitter<number>();

  @Input() pageSize = 5
  @Output() pageSizeChange = new EventEmitter<number>();

  @Input() searchFilter: string = '';
  @Output() searchFilterChange = new EventEmitter<string>();

  searchTimeout?: number

  get hasNextPage(){
    return this.currentPage < this.totalPages
  }

  get hasPreviousPage(){
    return this.currentPage > 1
  }

  handleCTAClicked(){
    this.router.navigate([this.createRoute || 'create'], {relativeTo: this.route})
  }

  goToDetails(item: any) {
    let routes = [item.id]

    if(this.detailsRoute){
      routes = this.detailsRoute.split('/').concat(routes)
    }

    this.router.navigate(routes, {relativeTo: this.route})
  }

  paginatePrev() {
    this.currentPage -= 1
    this.currentPageChange.emit(this.currentPage)
  }

  paginateNext() {
    this.currentPage += 1
    this.currentPageChange.emit(this.currentPage)
  }

  handleSearch() {
    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(()=> this.searchFilterChange.emit(this.searchFilter), 200)
  }
}
