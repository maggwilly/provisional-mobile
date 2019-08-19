import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommendesPage } from './commendes';
import { PipesModule} from '../../pipes/pipes.module';
import { DirectivesModule} from '../../directives/directives.module';
@NgModule({
  declarations: [
    CommendesPage,
  ],
  imports: [
    IonicPageModule.forChild(CommendesPage),
    PipesModule,
    DirectivesModule
  ],
})
export class CommendesPageModule {}
