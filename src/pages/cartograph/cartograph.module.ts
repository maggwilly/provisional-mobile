import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartographPage } from './cartograph';

@NgModule({
  declarations: [
    CartographPage,
  ],
  imports: [
    IonicPageModule.forChild(CartographPage),
  ],
})
export class CartographPageModule {}
