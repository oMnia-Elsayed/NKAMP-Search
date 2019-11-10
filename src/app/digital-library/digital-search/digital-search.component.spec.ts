import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalSearchComponent } from './digital-search.component';

describe('DigitalSearchComponent', () => {
  let component: DigitalSearchComponent;
  let fixture: ComponentFixture<DigitalSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
