import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {MovementForm} from './movement-form';
import {provideRouter, Router, ActivatedRoute} from '@angular/router';
import {By} from '@angular/platform-browser';
import {MovementsService} from '../../../../data/services/movements.service';
import {provideEnvironmentNgxMask} from 'ngx-mask';
import {provideHttpClient} from '@angular/common/http';

describe('MovementForm (integration)', () => {
  let fixture: ComponentFixture<MovementForm>;
  let component: MovementForm;
  let movementsService: MovementsService;

  function fillFormValidly() {
    const type = fixture.debugElement.query(By.css('#type'));
    const value = fixture.debugElement.query(By.css('#value'));

    type.nativeElement.value = '0'; // MovementType numeric enum
    type.nativeElement.dispatchEvent(new Event('change'));

    value.nativeElement.value = '150';
    value.nativeElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementForm],
      providers: [
        provideRouter([]),
        provideEnvironmentNgxMask(),
        provideHttpClient(),
        { provide: ActivatedRoute, useValue: { snapshot: { params: { clientId: 'c1', accountId: 'a1' } } } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MovementForm);
    component = fixture.componentInstance;
    movementsService = fixture.componentRef.injector.get(MovementsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep submit disabled until form is valid and then enable', () => {
    const submit = fixture.debugElement.query(By.css('input[type="submit"]'));
    expect(submit.nativeElement.disabled).toBeTrue();

    fillFormValidly();

    expect(component.movementForm.valid).toBeTrue();
    expect(submit.nativeElement.disabled).toBeFalse();
  });

  it('should call service.create and navigate on submit', fakeAsync(() => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');
    spyOn(movementsService, 'create').and.returnValue(Promise.resolve({} as any));

    fillFormValidly();

    const form = fixture.debugElement.query(By.css('form'));
    form.triggerEventHandler('submit', {});
    fixture.detectChanges();
    tick();

    expect(movementsService.create).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/movements']);
  }));
});
