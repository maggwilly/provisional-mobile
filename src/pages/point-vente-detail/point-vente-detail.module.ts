import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PointVenteDetailPage } from './point-vente-detail';
import { LastcommendeDirective } from '../../directives/lastcommende/lastcommende';
@NgModule({
  declarations: [
    PointVenteDetailPage,
    LastcommendeDirective
  ],
  imports: [
    IonicPageModule.forChild(PointVenteDetailPage),
  ],
})
export class PointVenteDetailPageModule {}
