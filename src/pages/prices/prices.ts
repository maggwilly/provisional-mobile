import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController  } from 'ionic-angular';
import { AppNotify } from '../../app/app-notify';
import { ManagerProvider} from '../../providers/manager/manager';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the PricesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prices',
  templateUrl: 'prices.html',
})
export class PricesPage {
   prices:any[]
  constructor(
    public navCtrl: NavController,
    public notify: AppNotify,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public storage: Storage) {
  }

  ionViewDidLoad() {
   
  }

 
}
