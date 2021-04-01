import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs/internal/observable/of';
import { CommandsService } from 'src/app/services/commands.service';
import { Directions } from 'src/app/shared/enums/directions.enum';
import { IConfig } from 'src/app/shared/interfaces/config.model';

import { RoverComponent } from './rover.component';


describe('RoverComponent', () => {
  let component: RoverComponent;
  let fixture: ComponentFixture<RoverComponent>;

  const config: IConfig = {
    initialOrientation: 0,
    numberOfSquares: 5,
    obstacles: 2,
    xCoordinate: 1,
    yCoordinate: 1,
  }
  let mockCommandService;

  beforeEach(async () => {

   mockCommandService = jasmine.createSpyObj(['getConfig', 'getStreamOfCommands', 'onSequenceEnded'])

    TestBed.configureTestingModule({
      declarations: [RoverComponent, ],
      providers: [
        {provide: CommandsService, useValue: mockCommandService}
      ]
    })    
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoverComponent);
    component = fixture.componentInstance;
    mockCommandService.getConfig.and.returnValue(config);
    mockCommandService.getStreamOfCommands.and.returnValue(of(""));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should point upwards when initial orientation in config is 0 ', () => {
    config.initialOrientation = 0;

    component.setInitialRotation()

    expect(component.currentOrientation).toBe(Directions.UPWARDS)
    expect(component.angle).toBe(0);
  });

  it('should point right when initial orientation in config is 1 ', () => {
    config.initialOrientation = 1;

    component.setInitialRotation()

    expect(component.currentOrientation).toBe(Directions.RIGHT)
    expect(component.angle).toBe(90);
  });
  
  it('should point down when initial orientation in config is 2 ', () => {
    config.initialOrientation = 2;

    component.setInitialRotation()

    expect(component.currentOrientation).toBe(Directions.DOWNWARDS)
    expect(component.angle).toBe(180);
  });

  it('should point left when initial orientation in config is 3 ', () => {
    config.initialOrientation = 3;

    component.setInitialRotation()

    expect(component.currentOrientation).toBe(Directions.LEFT)
    expect(component.angle).toBe(270);

  });
  
  it ('should subscribe to get the commands', () => {
    component.subscribeToCommands();
    
    expect(mockCommandService.getStreamOfCommands).toHaveBeenCalled();
  });

  it('should try to move forward when receives an f', ()=> {
    
    mockCommandService.getStreamOfCommands.and.returnValue(of("f"));
    fixture.detectChanges();
    spyOn(component, 'goForward')

    component.subscribeToCommands();

    expect(component.goForward).toHaveBeenCalled()
  })

  it('should try to turn right when receives an r', ()=> {
    
    mockCommandService.getStreamOfCommands.and.returnValue(of("r"));
    fixture.detectChanges();
    spyOn(component, 'turnRight')

    component.subscribeToCommands();

    expect(component.turnRight).toHaveBeenCalled()
  })

  it('should try to turn left when receives a l', ()=> {
    
    mockCommandService.getStreamOfCommands.and.returnValue(of("l"));
    fixture.detectChanges();
    spyOn(component, 'turnLeft')

    component.subscribeToCommands();

    expect(component.turnLeft).toHaveBeenCalled()
  })


  it('should call the service to end the sequence when receives an e', ()=> {
    
    mockCommandService.getStreamOfCommands.and.returnValue(of("e"));
    fixture.detectChanges();

    component.subscribeToCommands();

    expect(mockCommandService.onSequenceEnded).toHaveBeenCalled()
  })

  it('should move to the square above when facing upwards', () => {
    config.initialOrientation = Directions.UPWARDS;
    component.setInitialRotation()
    component.currentCoordinate = { top: 2, left: 2 };
    mockCommandService.getStreamOfCommands.and.returnValue(of("f"));
    spyOn(component.nextStep, 'emit');
    
    component.subscribeToCommands();

    expect(component.nextStep.emit).toHaveBeenCalledWith({ top: 1, left: 2})
  }) 

  it('should move to the square below when facing downwards', () => {
    config.initialOrientation = Directions.DOWNWARDS;
    component.setInitialRotation()
    component.currentCoordinate = { top: 2, left: 2 };
    mockCommandService.getStreamOfCommands.and.returnValue(of("f"));
    spyOn(component.nextStep, 'emit');
    
    component.subscribeToCommands();

    expect(component.nextStep.emit).toHaveBeenCalledWith({ top: 3, left: 2})
  })
  
  
  it('should move to the square left when facing left', () => {
    config.initialOrientation = Directions.LEFT;
    component.setInitialRotation()
    component.currentCoordinate = { top: 2, left: 2 };
    mockCommandService.getStreamOfCommands.and.returnValue(of("f"));
    spyOn(component.nextStep, 'emit');
    
    component.subscribeToCommands();

    expect(component.nextStep.emit).toHaveBeenCalledWith({ top: 2, left: 1})
  })

   it('should move to the square right when facing righ', () => {
    config.initialOrientation = Directions.RIGHT;
    component.setInitialRotation()
    component.currentCoordinate = { top: 2, left: 2 };
    mockCommandService.getStreamOfCommands.and.returnValue(of("f"));
    spyOn(component.nextStep, 'emit');
    
    component.subscribeToCommands();

    expect(component.nextStep.emit).toHaveBeenCalledWith({ top: 2, left: 3})
   })
  
  it('should face right when initial orientation is upwards and turns right', () => {
    component.currentOrientation = Directions.UPWARDS;
    component.turnRight()
    
    expect(component.currentOrientation).toBe(1)
  })

  it('should have an angle of 90 when initial orientation is upwards and turns right', () => {
    component.angle = 0;
    component.turnRight()
    
    expect(component.angle).toBe(90)
  })

  it('should should face downwards when initial orientation is right and turns right', () => {
    component.currentOrientation = Directions.RIGHT;
    component.turnRight()
    
    expect(component.currentOrientation).toBe(2)
  })
  
  it('should have an angle of 180 when initial orientation is right and turns right', () => {
    component.angle = 90;
    component.turnRight()
    
    expect(component.angle).toBe(180)
  })


  it('should face left when initial orientation is downwards and turns right', () => {
    component.currentOrientation = Directions.DOWNWARDS;
    component.turnRight()
    
    expect(component.currentOrientation).toBe(3)
  })

  it('should have an angle of 270  when initial orientation is downwards and turns right', () => {
    component.angle = 180;
    component.turnRight()
    
    expect(component.angle).toBe(270)
  })

  it('should should face upwards when initial orientation is left and turns right', () => {
    component.currentOrientation = Directions.LEFT;
    component.turnRight()
    
    expect(component.currentOrientation).toBe(0)
  })


  it('should have an angle of 360 when initial orientation is left and turns right', () => {
    component.angle = 270;
    component.turnRight()
    
    expect(component.angle).toBe(360)
  })

   it('should face left when initial orientation is upwards and turns left', () => {
    component.currentOrientation = Directions.UPWARDS;
    component.turnLeft()
    
    expect(component.currentOrientation).toBe(3)
  })

  
  it('should have an angle of -90 when initial orientation is upwards and turns left', () => {
    component.angle = 0;
    component.turnLeft()
    
    expect(component.angle).toBe(-90)
  })

  it('should should face upwards when initial orientation is right and turns left', () => {
    component.currentOrientation = Directions.RIGHT;
    component.turnLeft()
    
    expect(component.currentOrientation).toBe(0)
  })

  it('should have an angle of -180 when initial orientation is right and turns left', () => {
    component.angle = -90;
    component.turnLeft()
    
    expect(component.angle).toBe(-180)
  })
  
  it('should face right when initial orientation is downwards and turns left', () => {
    component.currentOrientation = Directions.DOWNWARDS;
    component.turnLeft()
    
    expect(component.currentOrientation).toBe(1)
  })

  it('should have an angle of -270 when initial orientation is downwards and turns left', () => {
    component.angle = -180;
    component.turnLeft()
    
    expect(component.angle).toBe(-270)
  })
  

  it('should should face downwards when initial orientation is left and turns left', () => {
    component.currentOrientation = Directions.LEFT;
    component.turnLeft()
    
    expect(component.currentOrientation).toBe(2)
  })

    it('should have an angle of -360 when initial orientation is left and turns left', () => {
    component.angle = -270;
    component.turnLeft()
    
    expect(component.angle).toBe(-360)
  })
  
});
