import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FiltreStatsPage } from './filtre-stats';

@NgModule({
  declarations: [
    FiltreStatsPage,
  ],
  imports: [
    IonicPageModule.forChild(FiltreStatsPage),
  ],
})
export class FiltreStatsPageModule {}
