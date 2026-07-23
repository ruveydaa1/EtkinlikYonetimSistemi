import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerSidebar } from './organizer-sidebar';

describe('OrganizerSidebar', () => {
  let component: OrganizerSidebar;
  let fixture: ComponentFixture<OrganizerSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(OrganizerSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
