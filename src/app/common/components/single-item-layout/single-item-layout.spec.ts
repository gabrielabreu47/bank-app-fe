import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {SingleItemLayout} from './single-item-layout';
import {Router} from '@angular/router';

// Test host component to test content projection
@Component({
  template: `
    <app-single-item-layout backRoute="clients">
      <div class="test-content">Projected content</div>
    </app-single-item-layout>
  `,
  standalone: true,
  imports: [SingleItemLayout]
})
class TestHostComponent {}

describe('SingleItemLayout', () => {
  let component: SingleItemLayout;
  let fixture: ComponentFixture<SingleItemLayout>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [SingleItemLayout],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleItemLayout);
    component = fixture.componentInstance;
    component.backRoute = 'test-route';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to backRoute when handleBack is called', () => {
    component.handleBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['test-route']);
  });
});

describe('SingleItemLayout with TestHost', () => {
  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let singleItemLayoutComponent: SingleItemLayout;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

    singleItemLayoutComponent = hostFixture.debugElement
      .query(By.directive(SingleItemLayout))
      .componentInstance;
  });

  it('should create with host', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should project content correctly', () => {
    const contentElement = hostFixture.debugElement.query(By.css('.test-content'));
    expect(contentElement).toBeTruthy();
    expect(contentElement.nativeElement.textContent.trim()).toBe('Projected content');
  });

  it('should have back button that calls handleBack', () => {
    spyOn(singleItemLayoutComponent, 'handleBack');

    const backButton = hostFixture.debugElement.query(By.css('.back-button'));
    expect(backButton).toBeTruthy();

    backButton.nativeElement.click();
    expect(singleItemLayoutComponent.handleBack).toHaveBeenCalled();
  });

  it('should navigate to clients route when back button is clicked', () => {
    const backButton = hostFixture.debugElement.query(By.css('.back-button'));
    backButton.nativeElement.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['clients']);
  });
});
