import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopOverMenuPage } from './pop-over-menu';

@NgModule({
  declarations: [
    PopOverMenuPage,
  ],
  imports: [
    IonicPageModule.forChild(PopOverMenuPage),
  ],
})
export class PopOverMenuPageModule {}
