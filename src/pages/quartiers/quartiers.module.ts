import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuartiersPage } from './quartiers'


@NgModule({
  declarations: [
    QuartiersPage,
  ],
  imports: [
    IonicPageModule.forChild(QuartiersPage),
  ],
})
export class QuartiersPageModule {}
