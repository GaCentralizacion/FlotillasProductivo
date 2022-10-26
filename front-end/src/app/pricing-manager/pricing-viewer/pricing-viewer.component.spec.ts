import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingViewerComponent } from './pricing-viewer.component';

describe('PricingViewerComponent', () => {
  let component: PricingViewerComponent;
  let fixture: ComponentFixture<PricingViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
