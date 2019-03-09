import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointventesPage } from './pointventes';

@NgModule({
  declarations: [
    PointventesPage,
  ],
  imports: [
    IonicPageModule.forChild(PointventesPage),
  ],
})
export class PointventesPageModule {}
