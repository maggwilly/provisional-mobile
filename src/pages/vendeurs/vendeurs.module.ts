import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendeursPage } from './vendeurs';

@NgModule({
  declarations: [
    VendeursPage,
  ],
  imports: [
    IonicPageModule.forChild(VendeursPage),
  ],
})
export class VendeursPageModule {}
