import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateVinComponent } from './validate-vin.component';

describe('ValidateVinComponent', () => {
  let component: ValidateVinComponent;
  let fixture: ComponentFixture<ValidateVinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateVinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateVinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
