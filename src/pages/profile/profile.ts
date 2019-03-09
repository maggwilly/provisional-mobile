import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppNotify } from '../../app/app-notify';
import { ManagerProvider} from '../../providers/manager/manager';
import {UserProvider } from '../../providers/user/user';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
   user:any={}
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public notify: AppNotify,
     public userService:UserProvider,
     public storage: Storage,
     public manager: ManagerProvider,) {
      this.user=this.navParams.get('user')
      console.log(this.user);
      
      if(!this.userService.amIMyParent())
      this.user.entreprise=this.user.parent.entreprise;
      this.user.pays=this.user.parent.pays;
      this.user.ville=this.user.parent.ville;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  isInvalid(){
    if(this.userService.amIMyParent())
        return (!this.user.entreprise||!this.user.ville||!this.user.pays)
        else
      return (!this.user.nom)
  }

dismiss(skippecheck=true){
  this.navCtrl.setRoot('TabsPage', {skippecheck:skippecheck}, {animate: true, direction: 'forward'}); 
}
  onSubmit(){
   this.manager.put('user',this.user).then((data)=>{
     if(data.id){
        this.storage.set('user',data).then(()=>{
          this.dismiss(false);
        })

     }
       
   },error=>{
     console.log(error);
     
    this.notify.onSuccess({message:"PROBLEME ! Verifiez votre connexion internet"})
   })
  }
}
