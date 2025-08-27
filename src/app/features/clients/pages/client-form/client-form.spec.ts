import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {ClientForm} from './client-form';
import {provideRouter, Router, ActivatedRoute} from '@angular/router';
import {By} from '@angular/platform-browser';
import {ClientsService} from '../../../../data/services/clients.service';
import {provideEnvironmentNgxMask} from 'ngx-mask';

describe('ClientForm (integration)', () => {
  let fixture: ComponentFixture<ClientForm>;
  let component: ClientForm;

  let clientsServiceSpy: jasmine.SpyObj<ClientsService>;

  function fillCreateFormValidly() {
    const name = fixture.debugElement.query(By.css('#name'));
    const lastName = fixture.debugElement.query(By.css('#lastName'));
    const password = fixture.debugElement.query(By.css('#password'));
    const confirmPassword = fixture.debugElement.query(By.css('#confirmPassword'));
    const gender = fixture.debugElement.query(By.css('#gender'));
    const birthDate = fixture.debugElement.query(By.css('#birthDate'));
    const identification = fixture.debugElement.query(By.css('#identification'));
    const address = fixture.debugElement.query(By.css('#address'));
    const phone = fixture.debugElement.query(By.css('#phone'));

    name.nativeElement.value = 'John';
    name.nativeElement.dispatchEvent(new Event('input'));

    lastName.nativeElement.value = 'Doe';
    lastName.nativeElement.dispatchEvent(new Event('input'));

    password.nativeElement.value = '123456';
    password.nativeElement.dispatchEvent(new Event('input'));

    confirmPassword.nativeElement.value = '123456';
    confirmPassword.nativeElement.dispatchEvent(new Event('input'));

    gender.nativeElement.value = '0'; // Gender.M
    gender.nativeElement.dispatchEvent(new Event('change'));

    birthDate.nativeElement.value = '1990-01-01';
    birthDate.nativeElement.dispatchEvent(new Event('input'));

    identification.nativeElement.value = 'ID-001';
    identification.nativeElement.dispatchEvent(new Event('input'));

    address.nativeElement.value = '123 Street';
    address.nativeElement.dispatchEvent(new Event('input'));

    phone.nativeElement.value = '(123) 456-7890';
    phone.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
  }

  beforeEach(async () => {
    clientsServiceSpy = jasmine.createSpyObj('ClientsService', ['create', 'update', 'readById']);

    await TestBed.configureTestingModule({
      imports: [ClientForm],
      providers: [
        provideRouter([]),
        provideEnvironmentNgxMask(),
        { provide: ClientsService, useValue: clientsServiceSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } },
      ],
    })
      .overrideComponent(ClientForm, {
        set: {
          providers: [{ provide: ClientsService, useValue: clientsServiceSpy }],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(ClientForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep submit disabled until form is valid and show password mismatch message', () => {
    const submit = fixture.debugElement.query(By.css('input[type="submit"]'));
    expect(submit.nativeElement.disabled).toBeTrue();

    // Set mismatching passwords
    const password = fixture.debugElement.query(By.css('#password'));
    const confirmPassword = fixture.debugElement.query(By.css('#confirmPassword'));

    password.nativeElement.value = 'abc';
    password.nativeElement.dispatchEvent(new Event('input'));
    confirmPassword.nativeElement.value = 'xyz';
    confirmPassword.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const mismatch = fixture.debugElement.query(By.css('.invalid'));
    expect(mismatch.nativeElement.textContent.trim()).toContain('Las contraseñas no coinciden');
    expect(submit.nativeElement.disabled).toBeTrue();

    // Fix passwords and fill the rest of fields
    fillCreateFormValidly();
    expect(component.clientForm.valid).toBeTrue();
    expect(submit.nativeElement.disabled).toBeFalse();
  });

  it('should call service.create and navigate on create submit', fakeAsync(() => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');
    clientsServiceSpy.create.and.returnValue(Promise.resolve({} as any));

    fillCreateFormValidly();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', {});
    fixture.detectChanges();

    // flush async submit
    tick();

    expect(clientsServiceSpy.create).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/clients']);
  }));

  it('should load client on edit and call update on submit', fakeAsync(() => {
    // Reconfigure with route param and readById data
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');

    const clientData = {
      id: 'c1',
      name: 'Jane',
      lastName: 'Smith',
      gender: 0,
      birthDate: '1992-02-02',
      identification: 'ID-002',
      address: '456 Ave',
      phone: '(111) 111-1111',
      password: '',
      status: true,
    };

    // Override ActivatedRoute snapshot param and service
    const ar = TestBed.inject(ActivatedRoute) as any;
    ar.snapshot.params = { clientId: 'c1' };
    clientsServiceSpy.readById.and.returnValue(Promise.resolve({ result: clientData } as any));

    // Trigger ngOnInit again
    component.ngOnInit();
    tick();
    fixture.detectChanges();

    // Password fields are hidden in edit mode
    const pwd = fixture.debugElement.query(By.css('#password'));
    const cpwd = fixture.debugElement.query(By.css('#confirmPassword'));
    expect(pwd).toBeNull();
    expect(cpwd).toBeNull();

    // Update some field and submit
    const name = fixture.debugElement.query(By.css('#name'));
    name.nativeElement.value = 'Janet';
    name.nativeElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    clientsServiceSpy.update.and.returnValue(Promise.resolve({} as any));

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', {});
    tick();

    expect(clientsServiceSpy.update).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/clients']);
  }));
});
