import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointVenteDetailPage } from './point-vente-detail';

@NgModule({
  declarations: [
    PointVenteDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PointVenteDetailPage),
  ],
})
export class PointVenteDetailPageModule {}
