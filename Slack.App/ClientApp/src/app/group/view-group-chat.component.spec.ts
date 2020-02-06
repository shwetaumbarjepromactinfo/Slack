import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGroupChatComponent } from './view-group-chat.component';

describe('ViewGroupChatComponent', () => {
  let component: ViewGroupChatComponent;
  let fixture: ComponentFixture<ViewGroupChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewGroupChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGroupChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
