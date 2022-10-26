import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudAprobacionUtilidadComponent } from './solicitud-aprobacion-utilidad.component';

describe('SolicitudAprobacionUtilidadComponent', () => {
  let component: SolicitudAprobacionUtilidadComponent;
  let fixture: ComponentFixture<SolicitudAprobacionUtilidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudAprobacionUtilidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudAprobacionUtilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
