import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudAprobacionCreditoComponent } from './solicitud-aprobacion-credito.component';

describe('SolicitudAprobacionCreditoComponent', () => {
  let component: SolicitudAprobacionCreditoComponent;
  let fixture: ComponentFixture<SolicitudAprobacionCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudAprobacionCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudAprobacionCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
