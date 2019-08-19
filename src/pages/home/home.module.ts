import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { IonTextAvatar } from 'ionic-text-avatar';
import { PipesModule} from '../../pipes/pipes.module';
import { DirectivesModule} from '../../directives/directives.module';
@NgModule({
  declarations: [
    HomePage,
    IonTextAvatar
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    PipesModule,
    DirectivesModule
  ],
})
export class HomePageModule {}
