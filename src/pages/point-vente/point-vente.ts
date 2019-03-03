import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ManagerProvider} from '../../providers/manager/manager';
import { IonicPage, NavController, ViewController,AlertController,ModalController  } from 'ionic-angular';
import { AppNotify } from '../../app/app-notify';
@IonicPage()
@Component({
  selector: 'page-point-vente',
  templateUrl: 'point-vente.html',
})
export class PointVentePage {
  pointVente:any={};


  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl:ModalController,
    public storage: Storage, 
    public viewCtrl: ViewController,
    public notify: AppNotify,
    public manager: ManagerProvider,) {
    }

  ionViewDidLoad() { 
        
  }


isInvalid():boolean {
  return (!this.pointVente.nom||!this.pointVente.description||!this.pointVente.tel);
}

dismiss(data?:any) {
      this.viewCtrl.dismiss(data);
  } 


onSubmit(){
  this.manager.post('pointvente',this.pointVente).then((data)=>{
    this.dismiss(data);
  },error=>{
    this.notify.onSuccess({message:"PROBLEME ! Verifiez votre connexion internet"})
  })
  
}

}
