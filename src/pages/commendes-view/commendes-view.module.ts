import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommendesViewPage } from './commendes-view';
import { DirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    CommendesViewPage,
  ],
  imports: [
    IonicPageModule.forChild(CommendesViewPage),
    DirectivesModule
  ],
})
export class CommendesViewPageModule {}
