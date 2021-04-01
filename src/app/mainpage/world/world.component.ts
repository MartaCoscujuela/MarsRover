import { HostListener } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommandsService } from '../../services/commands.service';
import { IObstacle } from '../obstacle/obstacle.model';
import { Directions } from '../../shared/enums/directions.enum';
import { IConfig } from '../../shared/interfaces/config.model';
import { ICoordinate } from '../../shared/interfaces/coordinate.model';

@Component({
  selector: 'app-world',
  templateUrl: './world.component.html',
  styleUrls: ['./world.component.sass']
})
  
export class WorldComponent implements OnInit {

  squares: number;
  numberOfObstacles: number;
  squareSize:number;
  worldSize = 0;
  maxSize = 500;
  windowWidth = 0; 
  roverSafeCoordinate: ICoordinate = { top: 0, left: 0 }
  roverOrientation = Directions.UPWARDS;
  obstacles: IObstacle[] = [];
  config: IConfig;
  constructor(private commandService: CommandsService, private router: Router) { }

  ngOnInit(): void {
    this.initElements(); 
  }
  
  initElements() {
    this.config = this.commandService.getConfig();
    if (!this.config) {
      this.router.navigate(['/']);
      return
    }
    this.generateWorld(window.innerWidth);
    this.generateRover(); 
    this.generateObstacles(); 
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (!this.config) {
      this.router.navigate(['/']);
    }
    this.generateWorld(window.innerWidth);
  }


  generateWorld(windowWidth) {
    this.windowWidth = windowWidth;
    this.squares = this.config.numberOfSquares;

    if (this.windowWidth > this.maxSize + 50) {
      this.worldSize = this.maxSize;
    } else {
      this.worldSize = this.windowWidth * 0.9;
    }
    this.squareSize = this.worldSize / this.squares;
  }

  generateRover() {
    this.roverSafeCoordinate = {
      top: this.config.yCoordinate,
      left: this.config.xCoordinate
    }

    switch (this.config.initialOrientation) {
      case 0:
        this.roverOrientation = Directions.UPWARDS;
        break;
      
      case 1:
         this.roverOrientation = Directions.RIGHT;
        break;
      
      case 2:
        this.roverOrientation = Directions.DOWNWARDS;
        break; 

      case 3:
        this.roverOrientation = Directions.LEFT;
        break;
    }
  }

  generateObstacles() {
    this.obstacles = [];
    this.numberOfObstacles = this.config.obstacles;
    const existingCoordinates: ICoordinate[] = [];
    existingCoordinates.push(this.roverSafeCoordinate)
    
    for (let i = 0; i < this.numberOfObstacles; i++) {
      let coordinate: ICoordinate;
      let isCoordinateTaken =  false; 
      do {
        coordinate = this.getRandomCoordinate()
        if (existingCoordinates.some(existingCoordinate => {
          return coordinate.top === existingCoordinate.top && coordinate.left === existingCoordinate.left
        })) {
          isCoordinateTaken = true;
          existingCoordinates.push(coordinate)

        } else {
          isCoordinateTaken = false
          existingCoordinates.push(coordinate)
        }
      } while (isCoordinateTaken)
       
      const obstacle: IObstacle = { coordinate }
      this.obstacles.push(obstacle);
    }
  }

  getRandomCoordinate() {
    return { top: this.getRandomSingleAxis(), left: this.getRandomSingleAxis() };
  }

  getRandomSingleAxis() {
    const singleAxis = Math.floor(Math.random() * (this.squares));;
    return singleAxis;
  }

  onRoverMoves(nextCoordinate: ICoordinate) {
    if (!this.checkIfCoordinateSafe(nextCoordinate)) {
      this.commandService.onSequenceEnded(false);
      return
    }
    this.roverSafeCoordinate = nextCoordinate;        
    setTimeout(() => {
      this.commandService.nextCommand()
    }, 300);
  }

  checkIfCoordinateSafe(nextCoordinate: ICoordinate) {

    if (this.obstacles.some(obstacle => 
      nextCoordinate.top === obstacle.coordinate.top
      && nextCoordinate.left === obstacle.coordinate.left
    )) {
      return false;
    }
      
    if (nextCoordinate.top < 0
      || nextCoordinate.top > this.squares - 1
      || nextCoordinate.left < 0
      || nextCoordinate.left > this.squares - 1
    ) {
      return false;
    }

    return true
  }

}
