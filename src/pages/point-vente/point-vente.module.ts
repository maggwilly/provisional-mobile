import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointVentePage } from './point-vente';

@NgModule({
  declarations: [
    PointVentePage,
  ],
  imports: [
    IonicPageModule.forChild(PointVentePage),
  ],
})
export class PointVentePageModule {}
