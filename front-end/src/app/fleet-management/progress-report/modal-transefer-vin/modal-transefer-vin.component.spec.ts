import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTranseferVinComponent } from './modal-transefer-vin.component';

describe('ModalTranseferVinComponent', () => {
  let component: ModalTranseferVinComponent;
  let fixture: ComponentFixture<ModalTranseferVinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTranseferVinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTranseferVinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
