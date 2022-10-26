import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTrasladosComponent } from './modal-traslados.component';

describe('ModalTrasladosComponent', () => {
  let component: ModalTrasladosComponent;
  let fixture: ComponentFixture<ModalTrasladosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalTrasladosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalTrasladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
