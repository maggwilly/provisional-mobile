import { Component } from '@angular/core';
import { ManagerProvider} from '../../providers/manager/manager';
import {AppNotify} from '../../app/app-notify';
import { IonicPage, NavController, NavParams  ,LoadingController} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  credentials:any={};
  constructor(
    public navCtrl: NavController,
    public manager:ManagerProvider,
    public appNotify: AppNotify,
    public loadingCtrl: LoadingController
     ) {
     }

  ionViewDidLoad() {
    console.log('Hello Login Page');
  }

isInvalid(){
  return !this.credentials.login;
}

onSubmit(){
  let loader = this.loadingCtrl.create({
      content: "Connexion...",
      duration: 8000
    });
   
 this.manager.authenticate(this.credentials).then(res=>{
  if(res){
     loader.dismiss();
     this.appNotify.onSuccess({message:'Vous êtes authentifié',showCloseButton:false});
   }
  else
    this.appNotify.onError({message:"Vous n'êtes authentifié reéssaye svp",showCloseButton:true});
  }); 
  loader.present();
 }
}
