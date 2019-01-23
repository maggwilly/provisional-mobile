import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommendesPage } from './commendes';

@NgModule({
  declarations: [
    CommendesPage,
  ],
  imports: [
    IonicPageModule.forChild(CommendesPage),
  ],
})
export class CommendesPageModule {}
