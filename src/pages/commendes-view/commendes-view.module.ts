import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommendesViewPage } from './commendes-view';

@NgModule({
  declarations: [
    CommendesViewPage,
  ],
  imports: [
    IonicPageModule.forChild(CommendesViewPage),
  ],
})
export class CommendesViewPageModule {}
