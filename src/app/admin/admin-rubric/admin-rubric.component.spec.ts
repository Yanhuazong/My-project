import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRubricComponent } from './admin-rubric.component';

describe('AdminRubricComponent', () => {
  let component: AdminRubricComponent;
  let fixture: ComponentFixture<AdminRubricComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRubricComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRubricComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
