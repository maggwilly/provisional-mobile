import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProduitPage } from './produit';

@NgModule({
  declarations: [
    ProduitPage,
  ],
  imports: [
    IonicPageModule.forChild(ProduitPage),
  ],
})
export class ProduitPageModule {}
