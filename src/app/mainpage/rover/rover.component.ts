import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommandsService } from '../../services/commands.service';
import { Directions } from '../../shared/enums/directions.enum';
import { ICoordinate } from '../../shared/interfaces/coordinate.model';
import { IStep } from '../../shared/interfaces/step.model';

@Component({
  selector: 'app-rover',
  templateUrl: './rover.component.html',
  styleUrls: ['./rover.component.sass']
})
export class RoverComponent implements OnInit, OnDestroy {

  @Input() steps: IStep[];
  @Input() currentCoordinate: ICoordinate; 
  @Input() size: number;
  @Input() initialOrientation: Directions.UPWARDS;
  
  currentOrientation = Directions.UPWARDS;

  @Output() nextStep = new EventEmitter<ICoordinate>();

  /* the angle is not set directly in the enum because it creates an ugly animation when changing from 0 degrees to 270 degrees. For this reason I thought it would be better if the angle is calculated dinamically adding and removing 90deg each time instad of setting fixed  values.  */
  angle = 0;
  currentCommandSequence: IStep[];
  index: number = 0; 
  subscription: Subscription;


  getsValue: string; 
  constructor(private commandService : CommandsService) { }

  ngOnInit(): void {
    this.subscribeToCommands();
    this.setInitialRotation();
  }

  setInitialRotation() {
    const config = this.commandService.getConfig();
    switch (+config.initialOrientation) {
      case 0:
        this.currentOrientation = Directions.UPWARDS
        break
      case 1:
        this.currentOrientation = Directions.RIGHT
        break
      case 2:
        this.currentOrientation = Directions.DOWNWARDS
        break
      case 3:
        this.currentOrientation = Directions.LEFT
        break
    }

    this.angle = 90 * config.initialOrientation;
  }

  subscribeToCommands() {
    this.subscription = this.commandService.getStreamOfCommands().subscribe({
      next: (command: string) => {
        this.processStep(command)
      }
    });
  }

  processStep(command: string) {

    switch (command) {
      case 'f':
        this.goForward();
        break;
      
      case 'l':
        this.turnLeft(); 
        break
      
      case 'r':
        this.turnRight();
        break
      case 'e':
        this.commandService.onSequenceEnded(true);
        break; 
    }
  }
  
  goForward() {
    let nextCoordinate = { ...this.currentCoordinate };
      switch (this.currentOrientation) {
        case Directions.UPWARDS:
          nextCoordinate.top = this.currentCoordinate.top - 1;
          break;
        
        
        case Directions.DOWNWARDS:
          nextCoordinate.top = this.currentCoordinate.top + 1;
          break;
        
        
        case Directions.LEFT: 
          nextCoordinate.left = this.currentCoordinate.left -1;
          break;
        
        
        case Directions.RIGHT:
          nextCoordinate.left = this.currentCoordinate.left + 1;
          break;
      }
    this.nextStep.emit(nextCoordinate);
  }

  turnLeft() {
    if (this.currentOrientation > 0){
      this.currentOrientation--
      
    } else {
      this.currentOrientation = 3
    }

    this.angle = this.angle - 90;
    this.nextStep.emit(this.currentCoordinate);

  }

  turnRight() {
      if (this.currentOrientation < 3) {
      this.currentOrientation ++
    } else {
      this.currentOrientation = 0
    }
    this.angle = this.angle + 90;
    this.nextStep.emit(this.currentCoordinate);

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
