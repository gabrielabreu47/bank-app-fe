import {ComponentFixture, TestBed} from '@angular/core/testing';

import {Clients} from './clients';
import {ClientsService} from '../../../../data/services/clients.service';
import {provideRouter} from '@angular/router';
import {routes} from '../../../../app.routes';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('Clients', () => {
  let component: Clients;
  let fixture: ComponentFixture<Clients>;
  let clientsServiceSpy: jasmine.SpyObj<ClientsService>;
  const testDate = '1990-01-01';

  beforeEach(async () => {
    const clientsSpy = jasmine.createSpyObj('ClientsService', ['readPaginated']);

    await TestBed.configureTestingModule({
      imports: [Clients, HttpClientTestingModule],
      providers: [
        { provide: ClientsService, useValue: clientsSpy },
        provideRouter(routes)
      ]
    })
    .compileComponents();

    clientsServiceSpy = TestBed.inject(ClientsService) as jasmine.SpyObj<ClientsService>;

    // Mock the readPaginated method to return test data
    clientsServiceSpy.readPaginated.and.returnValue(Promise.resolve({
      code: 200,
      message: 'success',
      succeed: true,
      result: {
        items: [
          {
            id: '1',
            name: 'John',
            lastName: 'Doe',
            gender: 0,
            birthDate: testDate,
            identification: '123456789',
            address: '123 Test St',
            phone: '1234567890',
            password: 'password',
            status: true
          },
          {
            id: '2',
            name: 'Jane',
            lastName: 'Smith',
            gender: 1,
            birthDate: testDate,
            identification: '987654321',
            address: '456 Test Ave',
            phone: '0987654321',
            password: 'password',
            status: true
          }
        ],
        totalPages: 1,
        pageSize: 10,
        totalItems: 2,
        pageNumber: 1,
        totalRecords: 10
      }
    }));

    fixture = TestBed.createComponent(Clients);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should reset to page 1 when search filter changes', () => {
    component.currentPage = 2;
    spyOn(component, 'getClients');

    component.handleSearchFilterChange();

    expect(component.currentPage).toBe(1);
    expect(component.getClients).toHaveBeenCalled();
  });
});
