import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CommandsService } from 'src/app/services/commands.service';

import { CommandFormComponent } from './command-form.component';

describe('CommandFormComponent', () => {
  let component: CommandFormComponent;
  let fixture: ComponentFixture<CommandFormComponent>;

  let mockCommandService;
  let mockRouter; 

  beforeEach(async () => {

    mockCommandService = jasmine.createSpyObj(['getListeningToCommands', 'setCommands' ])
    mockRouter = jasmine.createSpyObj(['navigate'])

    await TestBed.configureTestingModule({
      declarations: [CommandFormComponent],
      providers: [
        { provide: CommandsService, useValue: mockCommandService },
        { provide: Router, useValue: mockRouter }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandFormComponent);
    component = fixture.componentInstance;
    mockCommandService.getListeningToCommands.and.returnValue(of(true));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('should have the button enabled when listening to commands', () => {
    expect(component.buttonDisabled).toBeFalsy();
  });

  it('should have the button disabled when not listening to commands', () => {
    mockCommandService.getListeningToCommands.and.returnValue(of(false));
    component.subscribeToListeningCommands();
    fixture.detectChanges();

    expect(component.buttonDisabled).toBeTruthy();
  });

  it('should only accept specific letters', () => {
    component.commands.setValue("fr5fgrruffl");

    component.onUpdateCommand();
    component.commands.updateValueAndValidity()

    expect(component.commands.value).toEqual("frfrrffl");
  });


  it("should send the command when submitted", () => {
    component.commands.setValue("rRfL")
    component.commands.updateValueAndValidity()
    component.submit()
    expect(mockCommandService.setCommands).toHaveBeenCalledWith('rrfle');
  })
});
