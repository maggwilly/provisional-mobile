import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrevisionDetailsPage } from './prevision-details';
import { PipesModule} from '../../pipes/pipes.module';
import { DirectivesModule} from '../../directives/directives.module';
@NgModule({
  declarations: [
    PrevisionDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(PrevisionDetailsPage),
    PipesModule,
    DirectivesModule
  ],
})
export class PrevisionDetailsPageModule {}
