import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointVenteDetailPage } from './point-vente-detail';
import { PipesModule} from '../../pipes/pipes.module';
import { DirectivesModule} from '../../directives/directives.module';
@NgModule({
  declarations: [
    PointVenteDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PointVenteDetailPage),
    PipesModule,
    DirectivesModule
  ],
})
export class PointVenteDetailPageModule {}
