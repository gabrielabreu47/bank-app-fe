import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {AccountForm} from './account-form';
import {provideRouter, Router, ActivatedRoute} from '@angular/router';
import {By} from '@angular/platform-browser';
import {AccountsService} from '../../../../data/services/accounts.service';
import {provideEnvironmentNgxMask} from 'ngx-mask';

describe('AccountForm (integration)', () => {
  let fixture: ComponentFixture<AccountForm>;
  let component: AccountForm;
  let accountsServiceSpy: jasmine.SpyObj<AccountsService>;

  function fillCreateFormValidly() {
    const accountNumber = fixture.debugElement.query(By.css('#accountNumber'));
    const type = fixture.debugElement.query(By.css('#type'));
    const balance = fixture.debugElement.query(By.css('#balance'));
    const status = fixture.debugElement.query(By.css('#status'));

    accountNumber.nativeElement.value = 'ACC-001';
    accountNumber.nativeElement.dispatchEvent(new Event('input'));

    type.nativeElement.value = '0'; // AccountType values are numeric enums
    type.nativeElement.dispatchEvent(new Event('change'));

    balance.nativeElement.value = '1000';
    balance.nativeElement.dispatchEvent(new Event('input'));

    status.nativeElement.checked = true;
    status.nativeElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
  }

  beforeEach(async () => {
    accountsServiceSpy = jasmine.createSpyObj('AccountsService', ['create', 'update', 'readById']);

    await TestBed.configureTestingModule({
      imports: [AccountForm],
      providers: [
        provideRouter([]),
        provideEnvironmentNgxMask(),
        { provide: AccountsService, useValue: accountsServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { clientId: 'c1' } } } },
      ],
    })
      .overrideComponent(AccountForm, {
        set: {
          providers: [{ provide: AccountsService, useValue: accountsServiceSpy }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AccountForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep submit disabled until form is valid and then enable', () => {
    const submit = fixture.debugElement.query(By.css('input[type="submit"]'));
    expect(submit.nativeElement.disabled).toBeTrue();

    fillCreateFormValidly();

    expect(component.accountForm.valid).toBeTrue();
    expect(submit.nativeElement.disabled).toBeFalse();
  });

  it('should call service.create and navigate on create submit', fakeAsync(() => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');
    accountsServiceSpy.create.and.returnValue(Promise.resolve({} as any));

    fillCreateFormValidly();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', {});
    fixture.detectChanges();
    tick();

    expect(accountsServiceSpy.create).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/clients', 'c1']);
  }));

  it('should load account on edit and call update on submit', fakeAsync(() => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');

    const accountData = {
      id: 'a1',
      clientId: 'c1',
      accountNumber: 'ACC-002',
      type: 0,
      balance: 250,
      status: true,
    };

    const ar = TestBed.inject(ActivatedRoute) as any;
    ar.snapshot.params = { clientId: 'c1', accountId: 'a1' };
    accountsServiceSpy.readById.and.returnValue(Promise.resolve({ result: accountData } as any));

    component.ngOnInit();
    tick();
    fixture.detectChanges();

    // Modify a field and submit
    const balance = fixture.debugElement.query(By.css('#balance'));
    balance.nativeElement.value = '500';
    balance.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    accountsServiceSpy.update.and.returnValue(Promise.resolve({} as any));

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', {});
    tick();

    expect(accountsServiceSpy.update).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/clients', 'c1']);
  }));
});
