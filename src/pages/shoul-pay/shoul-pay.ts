import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController  } from 'ionic-angular';
import { AppNotify } from '../../app/app-notify';
import { ManagerProvider} from '../../providers/manager/manager';
import { Storage } from '@ionic/storage';



@IonicPage()
@Component({
  selector: 'page-shoul-pay',
  templateUrl: 'shoul-pay.html',
})
export class ShoulPayPage {
  abonnement:any;
  user:any;
  prices:any[]
  constructor(
    public navCtrl: NavController,
    public notify: AppNotify,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public storage: Storage
  ) {}

  ionViewDidLoad() {
    this.abonnement = this.navParams.get('abonnement');
    this.loadData()
  }

  loadData(){    

    this.manager.get('price',true).then(data=>{
      this.prices=data?data:[]
      this.storage.set('_prices',this.prices)    
    },error=>{
      this.notify.onError({message:"PROBLEME ! Verifiez votre connexion internet"})
    })

  }

dismiss(skippecheck=true){
   this.navCtrl.setRoot('MenuPage', {skippecheck:skippecheck}, {animate: true, direction: 'forward'}); 
}

  loadRemoteData(){
    let loader = this.loadingCtrl.create({
      content: "chargement...",
    });    
    this.manager.get('prices').then(data=>{
      this.prices=data?data:[]
      this.storage.set('_prices',this.prices)    
    },error=>{
      this.notify.onError({message:"PROBLEME ! Verifiez votre connexion internet"})
    })
    loader.present();
  }


  openPrice(price:any){
   this.navCtrl.push('PriceDetailPage',{price:price})
  }

}