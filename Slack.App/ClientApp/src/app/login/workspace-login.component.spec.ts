import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceLoginComponent } from './workspace-login.component';

describe('WorkspaceLoginComponent', () => {
  let component: WorkspaceLoginComponent;
  let fixture: ComponentFixture<WorkspaceLoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkspaceLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
