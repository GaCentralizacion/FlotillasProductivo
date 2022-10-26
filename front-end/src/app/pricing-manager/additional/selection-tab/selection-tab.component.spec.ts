import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionTabComponent } from './selection-tab.component';

describe('SelectionTabComponent', () => {
  let component: SelectionTabComponent;
  let fixture: ComponentFixture<SelectionTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
