import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudAprobacionUnidadesComponent } from './solicitud-aprobacion-unidades.component';

describe('SolicitudAprobacionUnidadesComponent', () => {
  let component: SolicitudAprobacionUnidadesComponent;
  let fixture: ComponentFixture<SolicitudAprobacionUnidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudAprobacionUnidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudAprobacionUnidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
