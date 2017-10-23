import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemscanChartComponent } from './systemscan-chart.component';

describe('SystemscanChartComponent', () => {
  let component: SystemscanChartComponent;
  let fixture: ComponentFixture<SystemscanChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemscanChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemscanChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
