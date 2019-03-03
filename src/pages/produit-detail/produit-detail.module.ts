import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProduitDetailPage } from './produit-detail';

@NgModule({
  declarations: [
    ProduitDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ProduitDetailPage),
  ],
})
export class ProduitDetailPageModule {}
