import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BaseList } from './base-list';
import { Router, ActivatedRoute } from '@angular/router';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
  template: `
    <app-base-list
      [title]="title"
      [columns]="columns"
      [items]="items"
      [filterBy]="filterBy"
      [hasDetails]="hasDetails"
      [canCreate]="canCreate"
      [canSearch]="canSearch"
      [currentPage]="currentPage"
      [totalPages]="totalPages"
      [loading]="loading"
      (currentPageChange)="onPageChange($event)"
      (pageSizeChange)="onPageSizeChange($event)"
      (searchFilterChange)="onSearchFilterChange($event)">
    </app-base-list>
  `,
  standalone: true,
  imports: [BaseList]
})
class TestHostComponent {
  title = 'Test List';
  columns = [
    { label: 'ID', value: 'id' },
    { label: 'Name', value: 'name' }
  ];
  items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' }
  ];
  filterBy = 'name';
  hasDetails = true;
  canCreate = true;
  canSearch = true;
  currentPage = 1;
  totalPages = 3;
  loading = false;

  onPageChange(page: number) {}
  onPageSizeChange(size: number) {}
  onSearchFilterChange(filter: string) {}
}

describe('BaseList', () => {
  let component: BaseList;
  let fixture: ComponentFixture<BaseList>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = {};

    await TestBed.configureTestingModule({
      imports: [BaseList, FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BaseList);
    component = fixture.componentInstance;

    // Set required inputs
    component.title = 'Test List';
    component.columns = [{ label: 'Name', value: 'name' }];
    component.filterBy = 'name';
    component.items = [];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter items by filterBy key', () => {
    component.columns = [{ label: 'Name', value: 'name' }];
    component.filterBy = 'name';

    const mockItems = [
      { id: 1, name: 'Juan' },
      { id: 2, name: 'Ana' },
      { id: 3, name: 'Pedro' }
    ];

    component.items = mockItems;

    component.searchFilter = 'an';
    component.handleSearch();

    // Clear timeout to trigger immediate search
    jasmine.clock().install();
    jasmine.clock().tick(201);
    jasmine.clock().uninstall();

    expect(component.items.filter(item =>
      item.name.toLowerCase().includes(component.searchFilter.toLowerCase())
    ).length).toBe(2);
  });

  it('should navigate to create on CTA click', () => {
    component.canCreate = true;
    component.handleCTAClicked();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['create'], { relativeTo: mockActivatedRoute });
  });

  it('should navigate to custom create route if specified', () => {
    component.canCreate = true;
    component.createRoute = 'custom-create';
    component.handleCTAClicked();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['custom-create'], { relativeTo: mockActivatedRoute });
  });

  it('should navigate to item details if hasDetails is true', () => {
    component.hasDetails = true;
    const item = { id: 42 };
    component.goToDetails(item);

    expect(mockRouter.navigate).toHaveBeenCalledWith([42], { relativeTo: mockActivatedRoute });
  });

  it('should navigate to custom details route if specified', () => {
    component.hasDetails = true;
    component.detailsRoute = 'custom/details';
    const item = { id: 42 };
    component.goToDetails(item);

    expect(mockRouter.navigate).toHaveBeenCalledWith(['custom', 'details', 42], { relativeTo: mockActivatedRoute });
  });

  it('should not filter if searchFilter is empty', () => {
    const items = [{ id: 1, name: 'Test' }];
    component.columns = [{ label: 'Name', value: 'name' }];
    component.filterBy = 'name';
    component.items = items;

    component.searchFilter = '';
    component.handleSearch();

    // Clear timeout to trigger immediate search
    jasmine.clock().install();
    jasmine.clock().tick(201);
    jasmine.clock().uninstall();

    expect(component.items).toEqual(items);
  });

  it('should emit searchFilterChange when handleSearch is called', fakeAsync(() => {
    spyOn(component.searchFilterChange, 'emit');
    component.searchFilter = 'test';
    component.handleSearch();

    tick(201); // Wait for the debounce timeout

    expect(component.searchFilterChange.emit).toHaveBeenCalledWith('test');
  }));

  it('should decrement currentPage and emit event when paginatePrev is called', () => {
    spyOn(component.currentPageChange, 'emit');
    component.currentPage = 2;

    component.paginatePrev();

    expect(component.currentPage).toBe(1);
    expect(component.currentPageChange.emit).toHaveBeenCalledWith(1);
  });

  it('should increment currentPage and emit event when paginateNext is called', () => {
    spyOn(component.currentPageChange, 'emit');
    component.currentPage = 1;

    component.paginateNext();

    expect(component.currentPage).toBe(2);
    expect(component.currentPageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should correctly determine if has next page', () => {
    component.currentPage = 1;
    component.totalPages = 3;
    expect(component.hasNextPage).toBeTrue();

    component.currentPage = 3;
    expect(component.hasNextPage).toBeFalse();
  });

  it('should correctly determine if has previous page', () => {
    component.currentPage = 1;
    expect(component.hasPreviousPage).toBeFalse();

    component.currentPage = 2;
    expect(component.hasPreviousPage).toBeTrue();
  });
});

describe('BaseList with TestHost', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let baseListComponent: BaseList;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

    baseListComponent = hostFixture.debugElement
      .query(By.directive(BaseList))
      .componentInstance;
  });

  it('should create with host', () => {
    expect(hostComponent).toBeTruthy();
    expect(baseListComponent).toBeTruthy();
  });

  it('should display the title', () => {
    const titleElement = hostFixture.debugElement.query(By.css('.title'));
    expect(titleElement.nativeElement.textContent.trim()).toBe('Test List');
  });

  it('should render table headers based on columns', () => {
    const headerCells = hostFixture.debugElement.queryAll(By.css('th.content-table-header-cell'));
    expect(headerCells.length).toBe(2);
    expect(headerCells[0].nativeElement.textContent.trim()).toBe('ID');
    expect(headerCells[1].nativeElement.textContent.trim()).toBe('Name');
  });

  it('should render table rows based on items', () => {
    const rows = hostFixture.debugElement.queryAll(By.css('tr.content-table-row'));
    expect(rows.length).toBe(3);

    const firstRowCells = rows[0].queryAll(By.css('td.content-table-cell'));
    expect(firstRowCells.length).toBe(2);
    expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('1');
    expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('Item 1');
  });

  it('should show search input when canSearch is true', () => {
    const searchInput = hostFixture.debugElement.query(By.css('.search-input'));
    expect(searchInput).toBeTruthy();
  });

  it('should hide search input when canSearch is false', () => {
    hostComponent.canSearch = false;
    hostFixture.detectChanges();

    const searchInput = hostFixture.debugElement.query(By.css('.search-input'));
    expect(searchInput).toBeFalsy();
  });

  it('should show CTA button when canCreate is true', () => {
    const ctaButton = hostFixture.debugElement.query(By.css('.cta-button'));
    expect(ctaButton).toBeTruthy();
    expect(ctaButton.nativeElement.textContent.trim()).toBe('Agregar');
  });

  it('should hide CTA button when canCreate is false', () => {
    hostComponent.canCreate = false;
    hostFixture.detectChanges();

    const ctaButton = hostFixture.debugElement.query(By.css('.cta-button'));
    expect(ctaButton).toBeFalsy();
  });

  it('should show pagination controls', () => {
    const paginationContainer = hostFixture.debugElement.query(By.css('.pagination-container'));
    expect(paginationContainer).toBeTruthy();

    const pageIndex = hostFixture.debugElement.query(By.css('.pagination-index'));
    expect(pageIndex.nativeElement.textContent.trim()).toBe('1/3');
  });

  it('should disable previous button on first page', () => {
    hostComponent.currentPage = 1;
    hostFixture.detectChanges();

    const prevButton = hostFixture.debugElement.queryAll(By.css('.pagination-button button'))[0];
    expect(prevButton.nativeElement.disabled).toBeTrue();
  });

  it('should disable next button on last page', () => {
    hostComponent.currentPage = 3;
    hostFixture.detectChanges();

    const nextButton = hostFixture.debugElement.queryAll(By.css('.pagination-button button'))[1];
    expect(nextButton.nativeElement.disabled).toBeTrue();
  });
});
