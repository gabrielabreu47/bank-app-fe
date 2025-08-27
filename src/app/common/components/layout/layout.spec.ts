import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Layout} from './layout';
import {RouterTestingModule} from '@angular/router/testing';
import {RouterOutlet} from '@angular/router';
import {By} from '@angular/platform-browser';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header with title "BANCO"', () => {
    const headerEl = fixture.debugElement.query(By.css('header h1'));
    expect(headerEl.nativeElement.textContent.trim()).toBe('BANCO');
  });

  it('should contain a router-outlet', () => {
    const outlet = fixture.debugElement.query(By.directive(RouterOutlet));
    expect(outlet).toBeTruthy();
  });
});
