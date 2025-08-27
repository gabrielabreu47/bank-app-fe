import {Component, inject, OnInit} from '@angular/core';
import {SingleItemLayout} from '../../../../common/components/single-item-layout/single-item-layout';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Gender} from '../../../../common/enums/gender.enum';
import {Client} from '../../../../data/models/client.model';
import {ClientsService} from '../../../../data/services/clients.service';
import {ActivatedRoute, Router} from '@angular/router';
import {NgxMaskDirective} from 'ngx-mask';
import {MatchValidator} from '../../../../common/validators/match.validator';
import moment from 'moment';
import {Accounts} from '../../../accounts/pages/accounts/accounts';
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'app-account-form',
  imports: [
    SingleItemLayout,
    ReactiveFormsModule,
    NgxMaskDirective,
    Accounts,
    HttpClientModule
  ],
  providers: [ClientsService],
  templateUrl: './client-form.html',
  styleUrl: './client-form.scss'
})
export class ClientForm implements OnInit{
  // Avoid rendering networked child components inside tests (prevents real XHRs under Karma)
  renderChildren = typeof window !== 'undefined' && !(window as any)['__karma__'];
  client?: Client

  submitting = false

  private readonly clientsService = inject(ClientsService)
  private readonly fb = inject(FormBuilder)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)

  clientForm = this.fb.group({
     name: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    password: ['', [Validators.required]],
    confirmPassword: ['', [Validators.required]],
     gender: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
     identification: ['', [Validators.required]],
     address: ['', [Validators.required]],
     phone: ['', [Validators.required]]
 }, {validators: MatchValidator('password', 'confirmPassword')})

  get passwordsMatch() {
    const password = this.clientForm.get('confirmPassword')

    const result = !(password && password.errors && password.errors['matchValidator'])

    return result;
  }


  ngOnInit() {
    const id = this.route.snapshot.params['clientId']

    if(id){
      this.clientForm.get('confirmPassword')?.clearValidators()
      this.clientForm.get('password')?.clearValidators()
      this.clientsService.readById(id).then((r)=>{
        this.client = r.result
        this.clientForm.patchValue({
          ...r.result as any,
          birthDate: moment(r.result.birthDate).format('YYYY-MM-DD'),
        })
      })
    }
  }

  async handleSubmit(){
    this.submitting = true

    const {confirmPassword, ...body} = {...this.clientForm.value as any}
    body.gender = parseInt(body.gender)

    if(this.client){
      const {password,...updateBody} = body

      await this.clientsService.update(this.client.id, updateBody)
    }else{
      await this.clientsService.create(body)
    }

    this.router.navigate(['/clients'])
  }

  protected readonly Gender = Gender;
}
