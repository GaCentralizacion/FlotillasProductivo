import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarPaqueteAdicionalesComponent } from './crear-editar-paquete-adicionales.component';

describe('CrearEditarPaqueteAdicionalesComponent', () => {
  let component: CrearEditarPaqueteAdicionalesComponent;
  let fixture: ComponentFixture<CrearEditarPaqueteAdicionalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearEditarPaqueteAdicionalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearEditarPaqueteAdicionalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
