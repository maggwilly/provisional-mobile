import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecteursPage } from './secteurs';

@NgModule({
  declarations: [
    SecteursPage,
  ],
  imports: [
    IonicPageModule.forChild(SecteursPage),
  ],
})
export class SecteursPageModule {}
