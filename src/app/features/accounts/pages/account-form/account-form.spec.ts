import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { AccountForm } from './account-form';
import { AccountsService } from '../../../../data/services/accounts.service';
import { AccountType } from '../../../../data/models/account.model';
import {provideEnvironmentNgxMask} from 'ngx-mask';
import * as testing from '@angular/common/http/testing';

describe('AccountForm', () => {
  let component: AccountForm;
  let fixture: ComponentFixture<AccountForm>;
  let accountsServiceSpy: jasmine.SpyObj<AccountsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    const accountsSpy = jasmine.createSpyObj('AccountsService', ['create', 'update', 'readById']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    activatedRouteMock = {
      snapshot: {
        params: {
          clientId: '1'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [AccountForm, ReactiveFormsModule, testing.HttpClientTestingModule],
      providers: [
        { provide: AccountsService, useValue: accountsSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        provideEnvironmentNgxMask(),
      ]
    })
    .compileComponents();

    accountsServiceSpy = TestBed.inject(AccountsService) as jasmine.SpyObj<AccountsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    const client = {
      id: '1',
      accountNumber: '123456',
      type: AccountType.Savings,
      balance: 1000,
      status: true,
      clientId: '1'
    }

    // Mock the create and update methods to return resolved promises
    accountsServiceSpy.create.and.returnValue(Promise.resolve(client));
    accountsServiceSpy.update.and.returnValue(Promise.resolve(client));
    accountsServiceSpy.readById.and.returnValue(Promise.resolve({
      code: 200,
      message: 'success',
      succeed: true,
      result: client
    }));

    fixture = TestBed.createComponent(AccountForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.accountForm.get('accountNumber')?.value).toBe('');
    expect(component.accountForm.get('type')?.value).toBe('');
    expect(component.accountForm.get('balance')?.value).toBe(0);
    expect(component.accountForm.get('status')?.value).toBe(true);
  });

  it('should set clientId from route params', () => {
    expect(component.clientId).toBe('1');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.accountForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all required fields are filled', () => {
    component.accountForm.patchValue({
      accountNumber: '123456',
      type: AccountType.Savings.toString(),
      balance: 1000,
      status: true
    });
    expect(component.accountForm.valid).toBeTruthy();
  });
});
