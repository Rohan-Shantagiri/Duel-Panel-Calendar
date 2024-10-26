import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DualPanelCalenderComponent } from './dual-panel-calender.component';

describe('DualPanelCalenderComponent', () => {
  let component: DualPanelCalenderComponent;
  let fixture: ComponentFixture<DualPanelCalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DualPanelCalenderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DualPanelCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
