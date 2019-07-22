import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FiltreVentePage } from './filtre-vente';

@NgModule({
  declarations: [
    FiltreVentePage,
  ],
  imports: [
    IonicPageModule.forChild(FiltreVentePage),
  ],
})
export class FiltreVentePageModule {}
