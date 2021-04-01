import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CommandsService } from 'src/app/services/commands.service';

@Component({
  selector: 'app-resultpanel',
  templateUrl: './resultpanel.component.html',
  styleUrls: ['./resultpanel.component.sass']
})
export class ResultpanelComponent implements OnInit {

  exploring: boolean;
  obstacle: boolean;
  started = false; 
  
  subscriptionListening: Subscription
  subscriptionSequenceSuccessful: Subscription
  
  constructor(private commandService: CommandsService) { }

  ngOnInit(): void
  {
    this.listenToEvents();
  }

  listenToEvents() {
    this.subscriptionListening = this.commandService.getListeningToCommands().subscribe((isListening: boolean) => {
      this.started = true;
      this.exploring = !isListening;
    });

    this.subscriptionSequenceSuccessful = this.commandService.getSuccessfulSequence().subscribe((wasSuccessful: boolean) => {
      this.started = true;
      this.obstacle = !wasSuccessful;
    });
  }

}
