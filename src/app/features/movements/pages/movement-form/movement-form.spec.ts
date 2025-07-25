import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { MovementForm } from './movement-form';
import { MovementsService } from '../../../../data/services/movements.service';
import { MovementType } from '../../../../data/models/movement.model';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {provideEnvironmentNgxMask} from 'ngx-mask';
import {HttpClientTestingModule, provideHttpClientTesting} from '@angular/common/http/testing';

describe('MovementForm', () => {
  let component: MovementForm;
  let fixture: ComponentFixture<MovementForm>;
  let movementsServiceSpy: jasmine.SpyObj<MovementsService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const movementsSpy = jasmine.createSpyObj('MovementsService', ['create']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [MovementForm, ReactiveFormsModule, HttpClientTestingModule],
      providers: [
        { provide: MovementsService, useValue: movementsSpy },
        { provide: Router, useValue: routerSpyObj },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {
                accountId: '1',
                clientId: '2'
              }
            }
          }
        },
        provideEnvironmentNgxMask()
      ]
    })
    .compileComponents();

    movementsServiceSpy = TestBed.inject(MovementsService) as jasmine.SpyObj<MovementsService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Mock the create method to return a resolved promise
    movementsServiceSpy.create.and.returnValue(Promise.resolve({
      type: MovementType.Credit,
      value: 100,
      date: '2025',
      balance: 0,
      id: '1'
    }));

    fixture = TestBed.createComponent(MovementForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.movementForm.get('type')?.value).toBe('');
    expect(component.movementForm.get('value')?.value).toBe(0);
  });

  it('should set accountId and clientId from route params', () => {
    expect(component.accountId).toBe('1');
    expect(component.clientId).toBe('2');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.movementForm.valid).toBeFalsy();
  });

  it('should mark form as valid when all required fields are filled', () => {
    component.movementForm.patchValue({
      type: MovementType.Credit.toString(),
      value: 100
    });
    expect(component.movementForm.valid).toBeTruthy();
  });
});
