import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import moment from 'moment';

import { ClientForm } from './client-form';
import { ClientsService } from '../../../../data/services/clients.service';
import { Gender } from '../../../../common/enums/gender.enum';
import {provideHttpClient} from '@angular/common/http';
import {provideEnvironmentNgxMask, provideNgxMask} from 'ngx-mask';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ClientForm', () => {
  let component: ClientForm;
  let fixture: ComponentFixture<ClientForm>;
  let clientsServiceSpy: jasmine.SpyObj<ClientsService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;
  const testDate = '1990-01-01';

  beforeEach(async () => {
    const clientsSpy = jasmine.createSpyObj('ClientsService', ['create', 'update', 'readById']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    activatedRouteMock = {
      snapshot: {
        params: {}
      }
    };

    await TestBed.configureTestingModule({
      imports: [ClientForm, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: ClientsService, useValue: clientsSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        provideEnvironmentNgxMask()
      ]
    })
    .compileComponents();

    clientsServiceSpy = TestBed.inject(ClientsService) as jasmine.SpyObj<ClientsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    const client = {
      id: '1',
      name: 'John',
      lastName: 'Doe',
      gender: Gender.M,
      birthDate: testDate,
      identification: '123456789',
      address: '123 Test St',
      phone: '1234567890',
      password: 'password',
      status: true
    }

    // Mock the create, update, and readById methods
    clientsServiceSpy.create.and.returnValue(Promise.resolve(client));
    clientsServiceSpy.update.and.returnValue(Promise.resolve(client));
    clientsServiceSpy.readById.and.returnValue(Promise.resolve({
      code: 200,
      message: 'success',
      succeed: true,
      result: client
    }));

    fixture = TestBed.createComponent(ClientForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.clientForm.get('name')?.value).toBe('');
    expect(component.clientForm.get('lastName')?.value).toBe('');
    expect(component.clientForm.get('password')?.value).toBe('');
    expect(component.clientForm.get('confirmPassword')?.value).toBe('');
    expect(component.clientForm.get('gender')?.value).toBe('');
    expect(component.clientForm.get('birthDate')?.value).toBe('');
    expect(component.clientForm.get('identification')?.value).toBe('');
    expect(component.clientForm.get('address')?.value).toBe('');
    expect(component.clientForm.get('phone')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.clientForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all required fields are filled and passwords match', () => {
    component.clientForm.patchValue({
      name: 'John',
      lastName: 'Doe',
      password: 'password',
      confirmPassword: 'password',
      gender: Gender.M,
      birthDate: testDate,
      identification: '123456789',
      address: '123 Test St',
      phone: '1234567890'
    });
    expect(component.clientForm.valid).toBeTruthy();
    expect(component.passwordsMatch).toBeTrue();
  });

  it('should mark form as invalid when passwords do not match', () => {
    component.clientForm.patchValue({
      name: 'John',
      lastName: 'Doe',
      password: 'password',
      confirmPassword: 'different',
      gender: Gender.M,
      birthDate: testDate,
      identification: '123456789',
      address: '123 Test St',
      phone: '1234567890'
    });
    expect(component.clientForm.valid).toBeFalsy();
    expect(component.passwordsMatch).toBeFalse();
  });

  it('should clear password validators when editing existing client', async () => {
    activatedRouteMock.snapshot.params.clientId = '1';

    component.ngOnInit();

    await fixture.whenStable();

    expect(component.clientForm.get('password')?.validator).toBeNull();
    expect(component.clientForm.get('confirmPassword')?.validator).toBeNull();
  });
});
