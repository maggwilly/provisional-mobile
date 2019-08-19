import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProduitsPage } from './produits';
import { DirectivesModule} from '../../directives/directives.module';
@NgModule({
  declarations: [
    ProduitsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProduitsPage),
    DirectivesModule
  ],
})
export class ProduitsPageModule {}
