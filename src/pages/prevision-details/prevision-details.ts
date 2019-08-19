import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PrevisionDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-prevision-details',
  templateUrl: 'prevision-details.html',
})
export class PrevisionDetailsPage {

  produit:any={}
  constructor(public navCtrl: NavController, public navParams: NavParams) {
   this.produit=this.navParams.get('produit');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PrevisionDetailsPage');
  }
  show(pointVente) {
    this.navCtrl.push('PointVenteDetailPage', { pointVente: pointVente })
  }
}
