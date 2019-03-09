import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectclientPage } from './selectclient';

@NgModule({
  declarations: [
    SelectclientPage,
  ],
  imports: [
    IonicPageModule.forChild(SelectclientPage),
  ],
})
export class SelectclientPageModule {}
