import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UnavailablePage } from './unavailable';

@NgModule({
  declarations: [
    UnavailablePage,
  ],
  imports: [
    IonicPageModule.forChild(UnavailablePage),
  ],
})
export class UnavailablePageModule {}
