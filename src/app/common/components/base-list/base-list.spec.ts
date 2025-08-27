import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {BaseList} from './base-list';
import {provideRouter, Router} from '@angular/router';
import {By} from '@angular/platform-browser';

interface Item { id: string; name: string; lastName: string; birthDate?: string; phone?: string; age?: number }

describe('BaseList (integration)', () => {
  let component: BaseList;
  let fixture: ComponentFixture<BaseList>;

  const columns = [
    { label: 'Nombre', value: 'name' },
    { label: 'Apellido', value: 'lastName' },
  ];

  const items: Item[] = [
    { id: '1', name: 'John', lastName: 'Doe' },
    { id: '2', name: 'Jane', lastName: 'Smith' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaseList],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseList);
    component = fixture.componentInstance;

    // Required inputs
    component.columns = columns as any;
    component.filterBy = 'name';
    component.title = 'Clientes';
    component.items = items as any;
    component.totalPages = 3;
    component.currentPage = 1;
    component.loading = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render headers and rows', () => {
    const headers = fixture.debugElement.queryAll(By.css('thead th'));
    expect(headers.map(h => h.nativeElement.textContent.trim())).toEqual(['Nombre', 'Apellido']);

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rows.length).toBe(2);
    const firstRowCells = rows[0].queryAll(By.css('td'));
    expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('John');
    expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('Doe');
  });

  it('should paginate next and previous emitting events', () => {
    const nextSpy = spyOn(component.currentPageChange, 'emit');

    const nextBtn = fixture.debugElement.query(By.css('.pagination-button:last-child button'));
    expect(nextBtn.nativeElement.disabled).toBeFalse();
    nextBtn.nativeElement.click();
    expect(component.currentPage).toBe(2);
    expect(nextSpy).toHaveBeenCalledWith(2);

    fixture.detectChanges();

    const prevBtn = fixture.debugElement.query(By.css('.pagination-button:first-child button'));
    expect(prevBtn.nativeElement.disabled).toBeFalse();
    prevBtn.nativeElement.click();
    expect(component.currentPage).toBe(1);
  });

  it('should emit searchFilterChange after debounce', fakeAsync(() => {
    const searchSpy = spyOn(component.searchFilterChange, 'emit');
    component.canSearch = true;
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input.search-input'));
    input.nativeElement.value = 'ja';
    input.triggerEventHandler('keyup', {});
    // model is two-way bound
    component.searchFilter = 'ja';

    tick(210);
    expect(searchSpy).toHaveBeenCalledWith('ja');
  }));

  it('should navigate when CTA clicked and when row clicked', () => {
    const router = TestBed.inject(Router);
    const navSpy = spyOn(router, 'navigate');

    // CTA
    component.canCreate = true;
    component.createRoute = 'create';
    fixture.detectChanges();
    const cta = fixture.debugElement.query(By.css('button.cta-button'));
    cta.nativeElement.click();
    expect(navSpy).toHaveBeenCalled();

    // Row click
    component.hasDetails = true;
    fixture.detectChanges();
    const row = fixture.debugElement.query(By.css('tbody tr'));
    row.nativeElement.click();
    expect(navSpy).toHaveBeenCalledTimes(2);
  });
});
