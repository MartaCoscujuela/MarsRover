import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObstacleComponent } from './obstacle.component';

describe('ObstacleComponent', () => {
  let component: ObstacleComponent;
  let fixture: ComponentFixture<ObstacleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObstacleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObstacleComponent);
    component = fixture.componentInstance;
    component.coordinate = {top:1, left: 1}
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
