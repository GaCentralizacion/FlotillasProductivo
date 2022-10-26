import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveConfirmationModalComponent } from './approve-confirmation-modal.component';

describe('ApproveConfirmationModalComponent', () => {
  let component: ApproveConfirmationModalComponent;
  let fixture: ComponentFixture<ApproveConfirmationModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveConfirmationModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
