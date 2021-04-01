import { Component, OnInit } from '@angular/core';
import { IConfig } from './shared/interfaces/config.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent{
  title = 'mars-rover';
}
