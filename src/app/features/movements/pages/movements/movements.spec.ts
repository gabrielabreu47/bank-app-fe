import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Movements} from './movements';
import {MovementsService} from '../../../../data/services/movements.service';
import {AccountsService} from '../../../../data/services/accounts.service';
import {ClientsService} from '../../../../data/services/clients.service';
import {MovementType} from '../../../../data/models/movement.model';
import {AccountType} from '../../../../data/models/account.model';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {provideRouter} from '@angular/router';
import {routes} from '../../../../app.routes';

describe('Movements', () => {
  let component: Movements;
  let fixture: ComponentFixture<Movements>;
  let movementsServiceSpy: jasmine.SpyObj<MovementsService>;
  let accountsServiceSpy: jasmine.SpyObj<AccountsService>;
  let clientsServiceSpy: jasmine.SpyObj<ClientsService>;

  beforeEach(async () => {
    const movementsSpy = jasmine.createSpyObj('MovementsService', ['readPaginated']);
    const accountsSpy = jasmine.createSpyObj('AccountsService', ['read']);
    const clientsSpy = jasmine.createSpyObj('ClientsService', ['read']);

    await TestBed.configureTestingModule({
      imports: [Movements, HttpClientTestingModule],
      providers: [
        { provide: MovementsService, useValue: movementsSpy },
        { provide: AccountsService, useValue: accountsSpy },
        { provide: ClientsService, useValue: clientsSpy },
        provideRouter(routes)
      ]
    })
    .compileComponents();

    movementsServiceSpy = TestBed.inject(MovementsService) as jasmine.SpyObj<MovementsService>;
    accountsServiceSpy = TestBed.inject(AccountsService) as jasmine.SpyObj<AccountsService>;
    clientsServiceSpy = TestBed.inject(ClientsService) as jasmine.SpyObj<ClientsService>;

    // Mock the readPaginated method to return test data
    movementsServiceSpy.readPaginated.and.returnValue(Promise.resolve({
      code: 200,
      message: 'succeed',
      succeed: true,
      result: {
        items: [
          { id: '1', date: "2025", type: MovementType.Debit, value: 100, balance: 900 },
          { id: '2', date: "2025", type: MovementType.Credit, value: 200, balance: 1100 }
        ],
        totalPages: 1,
        pageSize: 10,
        pageNumber: 1,
        totalRecords: 20
      }
    }));

    fixture = TestBed.createComponent(Movements);
    component = fixture.componentInstance;
    component.account = { id: '1', balance: 1000, accountNumber: '12341234', type: AccountType.Savings, status: true };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset to page 1 when search filter changes', () => {
    component.currentPage = 2;
    spyOn(component, 'getMovements');

    component.handleSearchFilterChange();

    expect(component.currentPage).toBe(1);
    expect(component.getMovements).toHaveBeenCalled();
  });
});
