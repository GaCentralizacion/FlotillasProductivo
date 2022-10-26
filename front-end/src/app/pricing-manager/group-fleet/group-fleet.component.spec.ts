import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupFleetComponent } from './group-fleet.component';

describe('GroupFleetComponent', () => {
  let component: GroupFleetComponent;
  let fixture: ComponentFixture<GroupFleetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupFleetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupFleetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
