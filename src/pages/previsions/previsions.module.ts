import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrevisionsPage } from './previsions';
import { PipesModule} from '../../pipes/pipes.module';
import { DirectivesModule} from '../../directives/directives.module';
@NgModule({
  declarations: [
    PrevisionsPage,
  ],
  imports: [
    IonicPageModule.forChild(PrevisionsPage),
    PipesModule,
    DirectivesModule
  ],
})
export class PrevisionsPageModule {}
