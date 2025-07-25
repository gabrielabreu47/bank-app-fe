import {Component, inject, OnInit} from '@angular/core';
import {SingleItemLayout} from '../../../../common/components/single-item-layout/single-item-layout';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Gender} from '../../../../common/enums/gender.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {MovementsService} from '../../../../data/services/movements.service';
import {Movement, MovementType} from '../../../../data/models/movement.model';
import moment from 'moment';
import {NgxMaskDirective} from 'ngx-mask';

@Component({
  selector: 'app-account-form',
  imports: [
    SingleItemLayout,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  providers: [MovementsService],
  templateUrl: './movement-form.html',
  styleUrl: './movement-form.scss'
})
export class MovementForm implements OnInit{
  submitting = false
  accountId: string = ''
  clientId: string = ''

  private readonly movementsService = inject(MovementsService)
  private readonly fb = inject(FormBuilder)
  private readonly route = inject(ActivatedRoute)
  private readonly router = inject(Router)

  movementForm = this.fb.group({
     type: ['', [Validators.required]],
     value: [0, [Validators.required]],
 })

  ngOnInit() {
    this.accountId = this.route.snapshot.params['accountId']
    this.clientId = this.route.snapshot.params['clientId']
  }

  async handleSubmit(){
    this.submitting = true

    const body = this.movementForm.value as any
    body.accountId = this.accountId
    body.type = parseInt(body.type)

    await this.movementsService.create(body)

    this.router.navigate(['/clients', this.clientId, 'accounts', this.accountId])
  }

  protected readonly MovementType = MovementType;
}
