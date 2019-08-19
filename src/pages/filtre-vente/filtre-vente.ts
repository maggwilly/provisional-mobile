import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';

@IonicPage()
@Component({
  selector: 'page-filtre-vente',
  templateUrl: 'filtre-vente.html',
})
export class FiltreVentePage {
  filtre: any = {visitedBy:""};
  users: any[] = []
  secteurs: any[] = [];
  constructor(
    public navCtrl: NavController,
    public manager: ManagerProvider,
    public viewCtrl: ViewController,
    public navParams: NavParams) {
    this.filtre = navParams.get('filtre') ? navParams.get('filtre') : {visitedBy:""};
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
