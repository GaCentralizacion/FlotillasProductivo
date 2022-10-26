import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferTableVinComponent } from './transfer-table-vin.component';

describe('TransferTableVinComponent', () => {
  let component: TransferTableVinComponent;
  let fixture: ComponentFixture<TransferTableVinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransferTableVinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferTableVinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
