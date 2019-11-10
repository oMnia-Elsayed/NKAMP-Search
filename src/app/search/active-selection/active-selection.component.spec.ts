import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveSelectionComponent } from './active-selection.component';

describe('ActiveSelectionComponent', () => {
  let component: ActiveSelectionComponent;
  let fixture: ComponentFixture<ActiveSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
