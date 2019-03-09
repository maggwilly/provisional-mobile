import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the UnavailablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-unavailable',
  templateUrl: 'unavailable.html',
})
export class UnavailablePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UnavailablePage');
  }
  retry(){
  this.navCtrl.setRoot('TabsPage', {skippecheck:false}, {animate: true, direction: 'forward'}); 
}
}
