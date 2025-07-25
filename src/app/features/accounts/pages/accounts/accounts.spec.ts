import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Accounts } from './accounts';
import { AccountsService } from '../../../../data/services/accounts.service';
import { translatedAccountType } from '../../../../data/models/account.model';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideRouter} from '@angular/router';
import {routes} from '../../../../app.routes';

describe('Accounts', () => {
  let component: Accounts;
  let fixture: ComponentFixture<Accounts>;
  let accountsServiceSpy: jasmine.SpyObj<AccountsService>;

  beforeEach(async () => {
    const accountsSpy = jasmine.createSpyObj('AccountsService', ['readPaginated']);

    await TestBed.configureTestingModule({
      imports: [Accounts],
      providers: [
        { provide: AccountsService, useValue: accountsSpy },
        provideHttpClient(),
        provideRouter(routes)
      ]
    })
    .compileComponents();

    accountsServiceSpy = TestBed.inject(AccountsService) as jasmine.SpyObj<AccountsService>;

    // Mock the readPaginated method to return test data
    accountsServiceSpy.readPaginated.and.returnValue(Promise.resolve({
      code: 200,
      message: 'success',
      succeed: true,
      result: {
        items: [
          { id: '1', accountNumber: '123456', type: 0, balance: 1000, status: true, clientId: '1' },
          { id: '2', accountNumber: '654321', type: 1, balance: 2000, status: true, clientId: '1' }
        ],
        totalPages: 1,
        pageSize: 10,
        pageNumber: 1,
        totalRecords: 10
      }
    }));

    fixture = TestBed.createComponent(Accounts);
    component = fixture.componentInstance;
    component.client = { id: '1', name: 'Test Client', lastName: 'test', birthDate: '2025', status: true, address: '123 Test St', phone: '1234567890', gender: 0, identification: '123456789', password: 'password' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call getAccounts if client is not set', async () => {
    component.client = undefined as any;
    await component.getAccounts();
    expect(accountsServiceSpy.readPaginated).not.toHaveBeenCalled();
  });

  it('should reset to page 1 when search filter changes', () => {
    component.currentPage = 2;
    spyOn(component, 'getAccounts');

    component.handleSearchFilterChange();

    expect(component.currentPage).toBe(1);
    expect(component.getAccounts).toHaveBeenCalled();
  });
});
