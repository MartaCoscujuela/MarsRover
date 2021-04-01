import { Component, Input, OnInit } from '@angular/core';
import { ICoordinate } from '../../shared/interfaces/coordinate.model';

@Component({
  selector: 'app-obstacle',
  templateUrl: './obstacle.component.html',
  styleUrls: ['./obstacle.component.sass']
})
export class ObstacleComponent {

  @Input() coordinate: ICoordinate;
  @Input() size: number; 
}
