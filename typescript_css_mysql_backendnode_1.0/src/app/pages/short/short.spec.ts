import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Short } from './short';

describe('Short', () => {
  let component: Short;
  let fixture: ComponentFixture<Short>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Short],
    }).compileComponents();

    fixture = TestBed.createComponent(Short);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
