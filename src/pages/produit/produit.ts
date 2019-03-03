import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AppNotify } from '../../app/app-notify';
import { ManagerProvider} from '../../providers/manager/manager';
/**
 * Generated class for the ProduitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-produit',
  templateUrl: 'produit.html',
})
export class ProduitPage {
produit:any={}
  constructor(
    public navCtrl: NavController,
     public storage: Storage,
       public navParams: NavParams, 
       public viewCtrl: ViewController,
       public notify: AppNotify,
    public manager: ManagerProvider,) {
  }
  ionViewDidLoad() { 
        
  }


isInvalid():boolean {
  return (!this.produit.nom||!this.produit.description||!this.produit.cout);
}

dismiss(data?:any) {
      this.viewCtrl.dismiss(data);
  } 


onSubmit(){
  this.manager.post('produit',this.produit).then((data)=>{
    this.dismiss(data);
  },error=>{
    this.notify.onSuccess({message:"PROBLEME ! Verifiez votre connexion internet"})
  })
  
}
}
