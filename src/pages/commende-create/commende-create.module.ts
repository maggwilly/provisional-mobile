import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommendeCreatePage } from './commende-create';

@NgModule({
  declarations: [
    CommendeCreatePage,
  ],
  imports: [
    IonicPageModule.forChild(CommendeCreatePage),
  ],
})
export class CommendeCreatePageModule {}
