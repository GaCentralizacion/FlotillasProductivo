import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguraTipoOrdenComponent } from './configura-tipo-orden.component';

describe('ConfiguraTipoOrdenComponent', () => {
  let component: ConfiguraTipoOrdenComponent;
  let fixture: ComponentFixture<ConfiguraTipoOrdenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfiguraTipoOrdenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfiguraTipoOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
