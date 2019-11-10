import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteBadgeComponent } from './favorite-badge.component';

describe('FavoriteBadgeComponent', () => {
  let component: FavoriteBadgeComponent;
  let fixture: ComponentFixture<FavoriteBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FavoriteBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriteBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
