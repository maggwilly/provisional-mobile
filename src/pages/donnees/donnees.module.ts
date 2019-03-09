import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DonneesPage } from './donnees';

@NgModule({
  declarations: [
    DonneesPage,
  ],
  imports: [
    IonicPageModule.forChild(DonneesPage),
  ],
})
export class DonneesPageModule {}
