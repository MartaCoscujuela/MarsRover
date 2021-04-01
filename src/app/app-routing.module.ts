import { NgModule } from '@angular/core'
import { PreloadAllModules, RouterModule, Routes } from '@angular/router'
import { FrontpageComponent } from './frontpage/frontpage.component'
import { MainPageComponent } from './mainpage/main-page.component'


const routes: Routes = [
  {
    path: '',
    component: FrontpageComponent
  },
  {
    path: 'world',
    component: MainPageComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'ignore',
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
