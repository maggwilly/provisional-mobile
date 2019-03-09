import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AppNotify } from '../../app/app-notify'
import { ManagerProvider } from '../../providers/manager/manager';
/**
 * Generated class for the RequestsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-requests',
  templateUrl: 'requests.html',
})
export class RequestsPage {
  requests:any[]=[]
  constructor(
    public navCtrl: NavController,
      public notify: AppNotify,
        public manager: ManagerProvider,
     public navParams: NavParams) {
    this.requests=this.navParams.get('requests');
    console.log(this.requests);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RequestsPage');
  }

  dismiss(skippecheck=true){
  this.navCtrl.setRoot('TabsPage', {skippecheck:skippecheck}, {animate: true, direction: 'forward'});  
  }

  accepter(request:any){
    console.log(request);
    
    let self=this;
  this.notify.showAlert({
    title:"Acceptation",
    message:"Voulez-vous integrer l'equipe de vente ?",
    buttons: [
      {
        text: 'Annuler',
        handler: () => {
          console.log('Disagree clicked');
        }
      },
      {
        text: 'Integrer',
        handler: (data) => {
                 let loader= this.notify.loading({
                 content: "Acceptation...",
                     }); 
          this.manager.delete('request',request,'accept').then(data=>{
            if(data.ok){
              loader.dismiss().then(()=>{
                self.dismiss(false);
                 this.notify.onSuccess({message:"Vous etes bien integre"})
               }); 
            }else{
              loader.dismiss()
               this.notify.onError({message:"L'operation n' a pas pu se derouler normalement"})
            }
          },error=>{
            loader.dismiss()
            this.notify.onError({message:"Un probleme est survenu"})
          })
            loader.present();
        }
      }
    ]
  }) 
  }

  refuser(request:any){
       console.log(request);
    let self=this;
    let loader= this.notify.loading({
      content: "Suppression...",
          }); 
this.manager.delete('request',request,'refuse').then(data=>{
 if(data.ok){
   loader.dismiss().then(()=>{
    if(this.requests.length<=1)
        return self.dismiss(false);
     let index= this.requests.findIndex(item=>item.id==data.deletedId);
     if(index>-1)
    this.requests.splice(index,1);
    }); 
 }else{
   loader.dismiss()
 }
},error=>{
 loader.dismiss()
 this.notify.onError({message:"Un probleme est survenu"})
})
 loader.present(); 
  }
}
