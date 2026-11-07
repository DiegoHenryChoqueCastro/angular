import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Quick } from './quick';

describe('Quick', () => {
  let component: Quick;
  let fixture: ComponentFixture<Quick>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Quick],
    }).compileComponents();

    fixture = TestBed.createComponent(Quick);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
