import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { CommandsService } from 'src/app/services/commands.service';

import { ResultpanelComponent } from './resultpanel.component';

describe('ResultpanelComponent', () => {
  let component: ResultpanelComponent;
  let fixture: ComponentFixture<ResultpanelComponent>;
  let mockCommandService;

  beforeEach(async () => {

    mockCommandService = jasmine.createSpyObj(['getListeningToCommands', 'getSuccessfulSequence'])

    await TestBed.configureTestingModule({
      declarations: [ResultpanelComponent],
      providers: [{ provide: CommandsService, useValue: mockCommandService }],

    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultpanelComponent);
    component = fixture.componentInstance;
    mockCommandService.getListeningToCommands.and.returnValue(of(true));
    mockCommandService.getSuccessfulSequence.and.returnValue(of(true));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set exploring to false when receives on listening', () => {
    mockCommandService.getListeningToCommands.and.returnValue(of(true));
    component.listenToEvents();
    fixture.detectChanges();
    expect(component.exploring).toBeFalsy();
  })

  
  it('should set exploring to true  when receives not on listening', () => {
    mockCommandService.getListeningToCommands.and.returnValue(of(false));
    component.listenToEvents();
    fixture.detectChanges();
    expect(component.exploring).toBeTruthy();
  })

  it('should set obstacles to true when receives sequence was not successful', () => {
    mockCommandService.getSuccessfulSequence.and.returnValue(of(false));
    component.listenToEvents();
    fixture.detectChanges();
    expect(component.obstacle).toBeTruthy();
  })

   it('should set obstacles to false when receives sequence was successful', () => {
    mockCommandService.getSuccessfulSequence.and.returnValue(of(true));
    component.listenToEvents();
    fixture.detectChanges();
    expect(component.obstacle).toBeFalsy();
  })

  it('should show the waiting message if started is false', () => {
    component.started = false;
    fixture.detectChanges();

    const waiting = fixture.debugElement.query(By.css('.waiting'));
    
    expect(waiting).toBeTruthy();
  })

  it('should not show the waiting message if started is true', () => {
    component.started = true;
    fixture.detectChanges();
    const waiting = fixture.debugElement.query(By.css('.waiting'));
    
    expect(waiting).toBeFalsy();
  })
  
  it('should show the exploring message if is exploring', () => {
    component.started = true;
    component.exploring = true;
    fixture.detectChanges();

    const exploring = fixture.debugElement.query(By.css('.exploring-message'));
    
    expect(exploring).toBeTruthy();
  })
  
  it('should show the danger message if its not exploring and found an obstacle', () => {
    component.started = true;
    component.exploring = false;
    component.obstacle = true
    fixture.detectChanges();

    const fail = fixture.debugElement.query(By.css('.fail-message'));
    
    expect(fail).toBeTruthy();
  })

  it('should show the success message if its not exploring and didnt find an obstacle', () => {
    component.started = true;
    component.exploring = false;
    component.obstacle = false
    fixture.detectChanges();

    const success = fixture.debugElement.query(By.css('.success-message'));
    
    expect(success).toBeTruthy();
  })

});
