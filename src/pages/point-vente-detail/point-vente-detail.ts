import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { Storage } from '@ionic/storage';
import { AppNotify } from '../../app/app-notify';

@IonicPage()
@Component({
  selector: 'page-point-vente-detail',
  templateUrl: 'point-vente-detail.html',
})
export class PointVenteDetailPage {
  pointVente: any={};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public notify: AppNotify,
    public storage: Storage
  ) {
    this.pointVente = navParams.get('pointVente');
  }

  ionViewDidLoad() {

  }

 
 
}