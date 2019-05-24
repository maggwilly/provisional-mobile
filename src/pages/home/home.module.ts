import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { IonTextAvatar } from 'ionic-text-avatar';

@NgModule({
  declarations: [
    HomePage,
    IonTextAvatar
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
  ],
})
export class HomePageModule {}
