import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { Storage } from '@ionic/storage';
import { AppNotify } from '../../app/app-notify';

/**
 * Generated class for the StatsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html',
})
export class StatsPage {

  stats:any
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public notify: AppNotify,
    public storage: Storage
  ) {
    
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData() {
    this.storage.get( '_stats').then((data) => {
      this.stats = data ? data :[];
      this.manager.get('stats').then(data => {
        this.stats = data ? data : []
        this.storage.set( '_stats', this.stats)
      },error=>{
        this.notify.onSuccess({message:"PROBLEME ! Verifiez votre connexion internet"})
      })
    });
  }


  loadRemoteData() {
    let loader = this.loadingCtrl.create({});
    this.manager.get('stats').then(data => {
      this.stats = data ? data : []
      this.storage.set( '_stats', this.stats)
    },error=>{
      this.notify.onSuccess({message:"PROBLEME ! Verifiez votre connexion internet"})
    });
    loader.present();
  }

 
 
}