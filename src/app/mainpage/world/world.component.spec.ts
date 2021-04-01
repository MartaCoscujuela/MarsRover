import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs/internal/observable/of';
import { CommandsService } from 'src/app/services/commands.service';
import { Directions } from 'src/app/shared/enums/directions.enum';
import { IConfig } from 'src/app/shared/interfaces/config.model';
import { ObstacleComponent } from '../obstacle/obstacle.component';
import { IObstacle } from '../obstacle/obstacle.model';
import { RoverComponent } from '../rover/rover.component';

import { WorldComponent } from './world.component';

describe('WorldComponent', () => {
  let component: WorldComponent;
  let fixture: ComponentFixture<WorldComponent>;

  const config: IConfig = {
    initialOrientation: 0,
    numberOfSquares: 5,
    obstacles: 2,
    xCoordinate: 1,
    yCoordinate: 1,
  }
  let mockCommandService;
  let mockRouter; 

  beforeEach(async () => {

    mockCommandService = jasmine.createSpyObj(['getConfig', 'getStreamOfCommands', 'onSequenceEnded'])
    mockRouter = jasmine.createSpyObj(['navigate'])


    await TestBed.configureTestingModule({
      declarations: [WorldComponent, RoverComponent, ObstacleComponent],
      providers: [
        { provide: CommandsService, useValue: mockCommandService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldComponent);
    component = fixture.componentInstance;
    mockCommandService.getConfig.and.returnValue(config);
    mockCommandService.getStreamOfCommands.and.returnValue(of(""));
    component.obstacles = []
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should navigate away if there is no config defined', () => {
    mockCommandService.getConfig.and.returnValue(null);
    
    component.initElements();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  })

  it('should generate a world that is no bigger than de max value', () => {
    component.generateWorld(3000);

    expect(component.worldSize).toEqual(component.maxSize);
  })

  it('should generate 50 squares per side of 10 pixels if the world is maxSize and the required square amount is 50', () => {
    config.numberOfSquares = 50;

    component.generateWorld(3000);

    expect(component.squareSize).toEqual(10);
  })

  it('should generate 4 sqares per side squares of 125 pixels if the world is maxSize and the required square amount is 4', () => {
    config.numberOfSquares = 4;

    component.generateWorld(3000);

    expect(component.squareSize).toEqual(125);
  })

  it('should generate a world that is 90% of the screen if it is not big enough', () => {
    component.generateWorld(100);

    expect(component.worldSize).toEqual(90);
  })

  it('should generate 9 per side squares per side of 10 pixels if the screen is 100px and the required square amount is 9', () => {
    config.numberOfSquares = 9;

    component.generateWorld(100);

    expect(component.squareSize).toEqual(10);
  })
  
  it('should set roverOrientetion upwards if config initial orientation is 0', () => {
    config.initialOrientation = 0
    
    component.generateRover()

    expect(component.roverOrientation).toEqual(Directions.UPWARDS);
  });

  it('should set roverOrientetion right if config initial orientation is 1', () => {
    config.initialOrientation = 1
    
    component.generateRover()

    expect(component.roverOrientation).toEqual(Directions.RIGHT);
  });

  it('should set roverOrientetion downwards if config initial orientation is 2', () => {
    config.initialOrientation = 2
    
    component.generateRover()

    expect(component.roverOrientation).toEqual(Directions.DOWNWARDS);
  });

  it('should set roverOrientetion left if config initial orientation is 3', () => {
    config.initialOrientation = 3
    
    component.generateRover()

    expect(component.roverOrientation).toEqual(Directions.LEFT);
  });

  it('should generate as many obstacles as required', () => {
    component.config.obstacles = 4;
    component.config.numberOfSquares = 30
    component.generateObstacles()

    expect(component.obstacles.length).toEqual(4);
  });

  it('should not generate any obstacle if config obstacles is 0', () => {
    component.config.obstacles = 0;
    component.config.numberOfSquares = 20;
    component.generateObstacles()

    expect(component.obstacles.length).toEqual(0);
  });

  it('should not generate any obstacle at the same position as the rover', () => {
    component.config.obstacles = 5;
    component.config.numberOfSquares = 20;
    component.roverSafeCoordinate = {top: 5, left: 12}

    component.generateObstacles()

    const match = component.obstacles.some((obstacle) => { obstacle.coordinate.top === 5 && obstacle.coordinate.left === 12});
    expect(false).toBeFalsy();
  });


  it('should detect when the rover is about to collide', () => {
    const nextCoordinate = { top: 5, left: 12 }
    const obstacle: IObstacle = { coordinate: {top: 5, left: 12}}
    component.obstacles.push(obstacle)
   
    const isSafe = component.checkIfCoordinateSafe(nextCoordinate);
    expect(isSafe).toBeFalsy();
  });
  
  it('should consider it is safe when the rover is not about to collide', () => {

    component.obstacles = []
    component.squares = 30
    const nextCoordinate = { top: 2, left: 2 }
    const obstacle: IObstacle = { coordinate: {top: 5, left: 3}}
    component.obstacles.push(obstacle)
   
    const isSafe = component.checkIfCoordinateSafe(nextCoordinate);
    expect(isSafe).toBeTruthy();
  }); 
 
});
