import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointventesPage } from './pointventes';
import { PipesModule} from '../../pipes/pipes.module';
import { DirectivesModule} from '../../directives/directives.module';
@NgModule({
  declarations: [
    PointventesPage,
  ],
  imports: [
    IonicPageModule.forChild(PointventesPage),
    PipesModule,
    DirectivesModule
  ],
})
export class PointventesPageModule {}
