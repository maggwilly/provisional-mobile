import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuartiersPage } from './quartiers'
import { GooglePlacesAutocompleteComponentModule } from 'ionic2-google-places-autocomplete';

@NgModule({
  declarations: [
    QuartiersPage,
  ],
  imports: [
    IonicPageModule.forChild(QuartiersPage),
    GooglePlacesAutocompleteComponentModule
  ],
})
export class QuartiersPageModule {}
