import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudAprobacionComponent } from './solicitud-aprobacion.component';

describe('SolicitudAprobacionComponent', () => {
  let component: SolicitudAprobacionComponent;
  let fixture: ComponentFixture<SolicitudAprobacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SolicitudAprobacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SolicitudAprobacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
