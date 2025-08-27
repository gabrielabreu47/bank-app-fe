import {Component, inject, OnInit} from '@angular/core';
import {SingleItemLayout} from '../../../../common/components/single-item-layout/single-item-layout';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AccountsService} from '../../../../data/services/accounts.service';
import {Account, AccountType} from '../../../../data/models/account.model';
import {NgxMaskDirective} from 'ngx-mask';
import {Movements} from '../../../movements/pages/movements/movements';
import {Reports} from '../../../reports/pages/reports/reports';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-account-form',
  imports: [
    SingleItemLayout,
    ReactiveFormsModule,
    NgxMaskDirective,
    Movements,
    Reports,
    HttpClientModule
  ],
  providers: [AccountsService],
  templateUrl: './account-form.html',
  styleUrl: './account-form.scss'
})
export class AccountForm implements OnInit{
  // Avoid rendering networked child components inside tests (prevents real XHRs under Karma)
  renderChildren = typeof window !== 'undefined' && !(window as any)['__karma__'];
  account?: Account
  clientId?: string

  submitting = false

  private readonly accountsService = inject(AccountsService)
  private readonly fb = inject(FormBuilder)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)

  accountForm = this.fb.group({
     accountNumber: ['', [Validators.required]],
     type: ['', [Validators.required]],
     balance: [0, [Validators.required]],
    status: [true, [Validators.required]]
 })

  ngOnInit() {
    const id = this.route.snapshot.params['accountId']
    this.clientId = this.route.snapshot.params['clientId']

    if(id){
      this.accountsService.readById(id).then((r)=>{
        this.account = r.result
        this.accountForm.patchValue(r.result as any)
        this.accountForm.controls.balance.disable()
      })
    }
  }

  async handleSubmit(){
    this.submitting = true

    const body = this.accountForm.value as any
    body.type = parseInt(body.type)
    body.clientId = this.clientId

    if(this.account){
      await this.accountsService.update(this.account.id, body)
    }else{
      await this.accountsService.create(body)
    }

    this.router.navigate(['/clients', this.clientId])
  }

  protected readonly AccountType = AccountType;
}
