import {Component, inject, Input, OnInit} from '@angular/core';
import {BaseList} from '../../../../common/components/base-list/base-list';
import {Report} from '../../../../data/models/report.model';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import {BaseListColumn} from '../../../../common/interfaces/base-list-column';
import {Account} from '../../../../data/models/account.model';
import {AccountsService} from '../../../../data/services/accounts.service';
import {FormsModule} from '@angular/forms';
import {Movement, translatedMovementType} from '../../../../data/models/movement.model';

@Component({
  selector: 'app-reports',
  imports: [
    BaseList,
    FormsModule,
  ],
  providers: [AccountsService],
  templateUrl: './reports.html',
  styleUrl: './reports.scss'
})
export class Reports implements OnInit{
  @Input() account!: Account
  private readonly accountsService = inject(AccountsService)

  report?: (Omit<Report, 'movements'> & {movements: (Omit<Movement, 'type'> & {type: string})[]})
  filterBy = 'client'
  fromDate?: string
  toDate?: string

  columns: BaseListColumn[] = [
    {
      label: 'Fecha',
      value: 'date',
      type: 'date'
    },
    {
      label: 'Tipo',
      value: 'type'
    },{
      label: 'Saldo inicial',
      value: 'initialBalance'
    },
    {
      label: 'Saldo disponible',
      value: 'currentBalance'
    },
  ]

  ngOnInit() {
    this.getReports()
  }

  async getReports(){
    const result = await this.accountsService.getReports(this.account.id, this.fromDate, this.toDate)

    this.report = {
      ...result.result,
      movements: result.result.movements.map((m)=>({
        ...m,
        type: translatedMovementType[m.type]
      }))
    }
  }

  downloadPdf() {
    const content = document.getElementById('reports-table');
    if (!content) return;

    html2canvas(content).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = pdf.internal.pageSize.getWidth();

      const imgProps = pdf.getImageProperties(imgData);
      const imgRatio = imgProps.width / imgProps.height;

      const pdfWidth = pageWidth;
      const pdfHeight = pageWidth / imgRatio;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('download.pdf');
    });
  }
}
