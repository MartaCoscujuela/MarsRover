import { TestBed } from '@angular/core/testing';
import { IConfig } from '../shared/interfaces/config.model';

import { CommandsService } from './commands.service';

describe('CommandsService', () => {
  let service: CommandsService;

  const config: IConfig = {
    initialOrientation: 0,
    numberOfSquares: 5,
    obstacles: 2,
    xCoordinate: 1,
    yCoordinate: 1,
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('it should not have any initial config', ()=> {
    expect(service.getConfig()).toBeFalsy()
  })

  it('should add a config when setConfig is called', ()=> {
    service.setConfig(config);
    
    expect(service.getConfig()).toBeTruthy();
  })

  it('should substract one unit to each coordinate when sent a config', () => {
    const newConfig = {...config}
    newConfig.xCoordinate = config.xCoordinate - 1;
    newConfig.yCoordinate = config.yCoordinate - 1;

    service.setConfig(config);
    
    expect(service.getConfig()).toEqual(newConfig);
  })

   it('should turn the string of commands into and array', () => {
    const commands = "frrlf";

    service.setCommands(commands)

    expect(service['commands']).toEqual(['f', 'r', 'r', 'l', 'f']);
  })

  it('should set index to zero everytime gets new commands', () => {

    service.setCommands('')

    expect(service['index']).toEqual(0);
  })

  it('should stop listening when gets the commands', () => {
    service.getListeningToCommands().subscribe((isListening) => {
      expect(isListening).toBeFalse();
    })
    service.setCommands('')
  })

  it("should send the next command when called NextCommand, if there are any commands left", () => {
    service['index'] = 1;
    service['commands'] = ['f', 'r', 'r', 'l', 'f'];

    service.getStreamOfCommands().subscribe((command) => {
      expect(command).toBe('r');
    })

    service.nextCommand();
  })

  it("should send the next command when called NextCommand, if there are any commands left", () => {
    service['index'] = 1;
    service['commands'] = ['f', 'r', 'r', 'l', 'f'];

    service.getStreamOfCommands().subscribe((command) => {
      expect(command).toBe('r');
    })

    service.nextCommand();
  })



});
