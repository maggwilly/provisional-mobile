import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import {UserProvider } from '../../providers/user/user';
import { AppNotify } from '../../app/app-notify'
/**
 * Generated class for the VendeursPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendeurs',
  templateUrl: 'vendeurs.html',
})
export class VendeursPage {
   vendeurs:any[]=[]
   requesteds:any[]=[]
   queryText = '';
  constructor(
     public navCtrl: NavController,
     public loadingCtrl: LoadingController,
     public manager: ManagerProvider,
      public userService:UserProvider,
     public notify: AppNotify,
     public storage: Storage,
     public navParams: NavParams
     ) {
  }

  ionViewDidLoad() {
    this.loadData()
  }

  loadData(){    
    this.manager.get('user',true).then(data=>{
      console.log(data);
      this.vendeurs=data?data.users:[];
      this.requesteds=data?data.requests:[];   
    },error=>{
      this.notify.onError({message:" Verifiez votre connexion internet"})
    })

  }

  loadRemoteData(){
    let loader= this.notify.loading({
      content: "chargement...",
    });    
    this.manager.get('user',true).then(data=>{
      console.log(data);
      this.vendeurs=data?data.users:[]
      this.requesteds=data?data.requests:[];
      loader.dismiss();       
    },error=>{
      loader.dismiss();   
      this.notify.onError({message:"Verifiez votre connexion internet"})
    })
    loader.present();
  }
 
  add(){
    let self=this;
    this.notify.showAlert({
      subTitle:"Nouveau vendeur",
      message:'Ajouter un membre a votre equipe de vente',
      inputs: [
        {
          name: 'nom',
          type: 'text',
          placeholder: 'Saisir le nom',
          value: ''

        },       
        {
          name: 'username',
          type: 'tel',
          placeholder: 'Numero de telephone',
          value: ''

        }

      ],
      buttons: [
        {
          text: 'Annuler',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Inviter',
          handler: (data) => {
            if(!data.username||data.username==self.userService.user.username)
                       return;
                 let loader= this.notify.loading({
                   content: "Invitation...",
                      });
            self.manager.save('request',data,true).then((req)=>{
              loader.dismiss().then(()=>{
                if(!req.id)
                   return 
               this.requesteds.splice(0,0,req); 
                 this.notify.onSuccess({message:"Demande envoyee !"})
               });
            },error=>{
                loader.dismiss()
                 this.notify.onError({message:"Verifiez votre connexion internet"})
            })
             loader.present();
          }
        }
      ]
    })
  }



  deleteRequest(requested:any){
    let loader= this.notify.loading({
      content: "Suppression...",
          }); 
this.manager.delete('request',requested,'delete',true).then(data=>{
 if(data.ok){
   loader.dismiss().then(()=>{
     let  index= this.requesteds.findIndex(item=>item.id==data.deletedId);
     if(index>-1)
     this.requesteds.splice(index,1);
     this.notify.onSuccess({message:"Element supprime"})
    }); 
 }else{
   loader.dismiss()
    this.notify.onError({message:"Cet element est lie a d'autres. Vous ne pouvez pas le supprimer"})
 }
},error=>{
 loader.dismiss()
 this.notify.onError({message:"Un probleme est survenu"})
})
 loader.present();
  }

  deleteUser(user:any){
  this.notify.showAlert({
    title:"Suppression",
    message:"Voulez-vous supprimer ce vendeur de votre equipe ?",
    buttons: [
      {
        text: 'Annuler',
        handler: () => {
          console.log('Disagree clicked');
        }
      },
      {
        text: 'Supprimer',
        handler: (data) => {
                 let loader= this.notify.loading({
                 content: "Suppression...",
                     }); 
          this.manager.delete('user',user,'delete',true).then(data=>{
            if(data.ok){
              loader.dismiss().then(()=>{
                let  index= this.vendeurs.findIndex(item=>item.id==data.deletedId);
                this.vendeurs.splice(index,1);
                this.notify.onSuccess({message:"Element supprime"})
               }); 
            }else{
              loader.dismiss()
               this.notify.onError({message:"Cet element est lie a d'autres. Vous ne pouvez pas le supprimer"})
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

  search() {
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    this.vendeurs.forEach(item => {
      item.hide = true;
      this.filter(item, queryWords);
    });

  }
  filter(item, queryWords) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.nom.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }
    item.hide = !(matchesQueryText);
  }
}
