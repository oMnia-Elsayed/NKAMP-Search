import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalResultComponent } from './digital-result.component';

describe('DigitalResultComponent', () => {
  let component: DigitalResultComponent;
  let fixture: ComponentFixture<DigitalResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
