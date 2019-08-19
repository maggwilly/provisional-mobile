import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';

/**
 * Generated class for the FiltreStatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filtre-stats',
  templateUrl: 'filtre-stats.html',
})
export class FiltreStatsPage {

  filtre: any = {doneBy:""};
  users: any[] = []
  secteurs: any[] = [];
  constructor(
    public navCtrl: NavController,
    public manager: ManagerProvider,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
    this.filtre = navParams.get('filtre') ? navParams.get('filtre') : {doneBy:""};
  }

  ionViewDidLoad() {
    this.manager.get('user').then(data => {
      this.users = data ? data : [];
    }, error => {
    })
    this.manager.get('secteur').then(data => {
      this.secteurs = data ? data : []
    }, error => {
      console.log(error);
    })
  }
  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }

  onSubmit() {
    this.viewCtrl.dismiss(this.filtre);
  }
}