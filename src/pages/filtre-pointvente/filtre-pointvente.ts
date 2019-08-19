import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { ManagerProvider} from '../../providers/manager/manager';
/**
 * Generated class for the FiltrePointventePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filtre-pointvente',
  templateUrl: 'filtre-pointvente.html',
})
export class FiltrePointventePage {
   filtre:any={user:""};
   secteurs:any[]=[];
   users:any[]=[]
  constructor(public navCtrl: NavController,
    public modalCtrl:ModalController,
    public viewCtrl: ViewController,
     public manager: ManagerProvider,
     public navParams: NavParams) {
    this.filtre=navParams.get('filtre')?navParams.get('filtre'):{user:""};
  }



  ionViewDidLoad() { 
    this.manager.get('secteur').then(data=>{
      this.secteurs=data?data:[]
    },error=>{
     console.log(error);
    })
    this.manager.get('user').then(data=>{
      this.users=data?data:[] ; 
    },error=>{
    })      
  }
  dismiss(data?:any) {
    this.viewCtrl.dismiss(data);
} 

onSubmit(){
  this.viewCtrl.dismiss(this.filtre);
}

  select(){
    let modal=this.modalCtrl.create('QuartiersPage',{ville:this.filtre.ville});
    modal.onDidDismiss(data => {
          this.filtre.quartier=data;
     });
     modal.present();
  }
}
