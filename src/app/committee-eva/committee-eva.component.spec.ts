import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommitteeEvaComponent } from './committee-eva.component';

describe('CommitteeEvaComponent', () => {
  let component: CommitteeEvaComponent;
  let fixture: ComponentFixture<CommitteeEvaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommitteeEvaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommitteeEvaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
