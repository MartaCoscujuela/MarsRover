import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ControlContainer, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { By } from 'protractor';
import { CommandsService } from 'src/app/services/commands.service';

import { ConfigFormComponent } from './config-form.component';

describe('ConfigFormComponent', () => {
  let component: ConfigFormComponent;
  let fixture: ComponentFixture<ConfigFormComponent>;

  let mockCommandService;
  let mockRouter; 
  beforeEach(async () => {
    mockCommandService = jasmine.createSpyObj(['setConfig'])
    mockRouter = jasmine.createSpyObj(['navigate'])

    await TestBed.configureTestingModule({
      declarations: [ConfigFormComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: CommandsService, useValue: mockCommandService },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not allow letters in number only function', () => {
    
    let event: any = {which: 'c'.charCodeAt(0)}
    const result = component.numberOnly(event)
    
    expect(result).toBeFalsy();
  });

    it('should  allow numbers in number only function', () => {
    
    let event: any = {which: '0'.charCodeAt(0)}
    const result = component.numberOnly(event)
    
    expect(result).toBeTruthy();
  });

  it("should not allow more than 50 squares", () => {
    component.numberOfSquares.setValue(51);

    component.numberOfSquares.updateValueAndValidity();

    expect(component.numberOfSquares.valid).toBeFalsy()
  })

  it("should not allow less than 4 squares", () => {
    component.numberOfSquares.setValue(2);

    component.numberOfSquares.updateValueAndValidity();

    expect(component.numberOfSquares.valid).toBeFalsy()
  })

  
  it("should allow a value between 4 and 50 squares", () => {
    component.numberOfSquares.setValue(30);

    component.numberOfSquares.updateValueAndValidity();

    expect(component.numberOfSquares.valid).toBeTruthy()
  })

  
  it("should not allow negative Xcoordinates", () => {
    component.xCoordinate.setValue(-5);

    component.xCoordinate.updateValueAndValidity();

    expect(component.xCoordinate.valid).toBeFalsy()
  })

   it("should not allow negative Ycoordinates", () => {
    component.yCoordinate.setValue(-5);

    component.yCoordinate.updateValueAndValidity();

    expect(component.yCoordinate.valid).toBeFalsy()
  })

  it("should not allow 0 Xcoordinates", () => {
    component.xCoordinate.setValue(0);

    component.xCoordinate.updateValueAndValidity();

    expect(component.xCoordinate.valid).toBeFalsy()
  })

   it("should not allow 0 Ycoordinates", () => {
    component.yCoordinate.setValue(0);

    component.yCoordinate.updateValueAndValidity();

    expect(component.yCoordinate.valid).toBeFalsy()
   })
  
  
  it("should not allow  Xcoordinates to be greater or equal than number of squares", () => {
    component.numberOfSquares.setValue(10)
    component.numberOfSquares.markAsDirty()
    component.numberOfSquares.updateValueAndValidity();

    component.xCoordinate.setValue(10);

    component.xCoordinate.updateValueAndValidity();

    expect(component.xCoordinate.valid).toBeFalsy()
  })

  it("should not allow  ycoordinates to be greater or equal than number of squares", () => {
    component.numberOfSquares.setValue(10)
    component.numberOfSquares.markAsDirty()
    component.numberOfSquares.updateValueAndValidity();

    component.yCoordinate.setValue(10);

    component.yCoordinate.updateValueAndValidity();

    expect(component.yCoordinate.valid).toBeFalsy()
  })

  
  it("should not allow a greater amount of monsters than squares available", () => {
    component.numberOfSquares.setValue(10)
    component.numberOfSquares.markAsDirty()
    component.numberOfSquares.updateValueAndValidity();

    component.obstacles.setValue(100)
    component.obstacles.updateValueAndValidity();

    expect(component.obstacles.valid).toBeFalsy();
  })

  
  it("should allow any number of obstacles as long as there is enough room", () => {
    component.numberOfSquares.setValue(10)
    component.numberOfSquares.markAsDirty()
    component.numberOfSquares.updateValueAndValidity();

    component.obstacles.setValue(98)
    component.obstacles.updateValueAndValidity();

    expect(component.obstacles.valid).toBeTruthy();
  })

  it("should redirect on submit if form is valid", () => {
    const control = new FormControl('', Validators.required);
    component.configForm = new FormGroup({ control: control })
    control.setValue('foo')

    component.submit();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/world']);
  });

  it("should redirect on submit if form is valid", () => {
    component.configForm = new FormGroup({control: new FormControl('', Validators.required)})
    component.submit();
    expect(mockRouter.navigate).not.toHaveBeenCalledWith(['/world']);
  });
 
  it("should send the config on submit if form is valid", () => {
    const control = new FormControl('', Validators.required);
    component.configForm = new FormGroup({ control: control })
    control.setValue('foo')

    component.submit()

    expect(mockCommandService.setConfig).toHaveBeenCalled()
  })

});
