import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { WorldComponent } from './mainpage/world/world.component';
import { RoverComponent } from './mainpage/rover/rover.component';
import { ObstacleComponent } from './mainpage/obstacle/obstacle.component';
import { ConfigFormComponent } from './frontpage/config-form/config-form.component';
import { CommandFormComponent } from './mainpage/command-form/command-form.component';
import { FrontpageComponent } from './frontpage/frontpage.component';
import { MainPageComponent } from './mainpage/main-page.component';
import { AppRoutingModule } from './app-routing.module';
import { ResultpanelComponent } from './mainpage/resultpanel/resultpanel.component';
import { LoadingComponent } from './shared/loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    WorldComponent,
    RoverComponent,
    ObstacleComponent,
    ConfigFormComponent,
    CommandFormComponent,
    FrontpageComponent,
    MainPageComponent,
    ResultpanelComponent,
    LoadingComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
