import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommandsService } from '../../services/commands.service';
@Component({
  selector: 'app-command-form',
  templateUrl: './command-form.component.html',
  styleUrls: ['./command-form.component.sass']
})
export class CommandFormComponent implements OnInit, OnDestroy {

 
  constructor(private commandsService: CommandsService, private router: Router) { }

  configForm: FormGroup;
  commands: FormControl;
  buttonDisabled = false;
  subscription: Subscription;
  
  ngOnInit(): void {
    this.createForm();
    this.subscribeToListeningCommands();
  }
  
  subscribeToListeningCommands() {
    this.subscription = this.commandsService.getListeningToCommands().subscribe(val => {
      this.buttonDisabled = !val
      this.commands.setValue('');
    })
  }

  createForm() {
    this.commands = new FormControl('', [
      Validators.requiredTrue,
      Validators.pattern('[f][l][r][F][L][R]')
    ]);

    this.configForm = new FormGroup({
      command: this.commands
    })
  }

  onUpdateCommand() {
    const newValue = this.commands.value.split('').filter((char) => {
      const checkChar = char.toLowerCase();
      return !(checkChar !== 'f' && checkChar !== 'l' && checkChar !== 'r')
    });

    const newValueString = newValue.join('');
    this.commands.setValue(newValueString)
  }

  sendCommand() {
    this.commandsService.nextCommand();
  }

  submit() {
    this.buttonDisabled = true; 
    const commandToSend = this.commands.value+'e'
    this.commandsService.setCommands(commandToSend.toLowerCase());
  }

  back() {
      this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

