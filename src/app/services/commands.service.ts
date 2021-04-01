import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { IConfig } from '../shared/interfaces/config.model';

@Injectable({
  providedIn: 'root'
})
export class CommandsService {

  constructor() { }

  private commands: string[];
  private config: IConfig; 
  private index = 0; 
  private nextCommand$ = new Subject<string>();
  private listeningToCommands$ = new Subject<boolean>();
  private successfulSequence$ = new Subject<boolean>();

  
  setConfig({ ...newConfig }: IConfig) {
    newConfig.xCoordinate = newConfig.xCoordinate-1;
    newConfig.yCoordinate = newConfig.yCoordinate - 1;
    this.config = { ...newConfig };
  }

  getConfig() {
    return this.config;
  }

  getStreamOfCommands() {
    return this.nextCommand$ as Observable<string>;
  }

  setCommands(commands: string) {
    this.index = 0;
    this.commands = commands.split('');
    this.listeningToCommands$.next(false);
    this.nextCommand();
  }

  nextCommand() {
    if (this.index < this.commands.length) {
      this.nextCommand$.next(this.commands[this.index]);
      this.index++;
    } 
  }

  listeningToCommands(isListening: boolean) {
    this.listeningToCommands$.next(isListening)
  }

  getListeningToCommands() {
    return this.listeningToCommands$ as Observable<boolean>;
  }

  getSuccessfulSequence() {
    return this.successfulSequence$ as Observable<boolean>;
  }

  onSequenceEnded(successful: boolean) {
    this.listeningToCommands(true);
    this.successfulSequence$.next(successful);
  }
}
