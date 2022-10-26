import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PricingManagerComponent } from './pricing-manager.component';

describe('PricingManagerComponent', () => {
  let component: PricingManagerComponent;
  let fixture: ComponentFixture<PricingManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PricingManagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PricingManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
