import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DigitalLibraryComponent } from './digital-library.component';

describe('DigitalLibraryComponent', () => {
  let component: DigitalLibraryComponent;
  let fixture: ComponentFixture<DigitalLibraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DigitalLibraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DigitalLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
