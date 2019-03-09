import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';

import { ManagerProvider} from '../../providers/manager/manager';
import { IonicPage, NavParams, NavController, ViewController  } from 'ionic-angular';
import { AppNotify } from '../../app/app-notify';
@IonicPage()
@Component({
  selector: 'page-point-vente',
  templateUrl: 'point-vente.html',
})
export class PointVentePage {
  pointVente:any={};
  secteurs:any[]=[]
  constructor(
    public navCtrl: NavController,
    public storage: Storage, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public notify: AppNotify,
    public manager: ManagerProvider,) {
      this.pointVente=this.navParams.get('pointVente')
      if(this.pointVente.secteur)
        this.pointVente.secteur=this.pointVente.secteur.id;
    }

  ionViewDidLoad() { 
    this.storage.get('_secteurs').then((data) => {
      this.secteurs = data?data:[];
    this.manager.get('secteur').then(data=>{
      this.secteurs=data?data:[]
      this.storage.set('_secteurs',this.secteurs)    
    },error=>{
      this.notify.onError({message:" Verifiez votre connexion internet"})
    })
  });   
  }


isInvalid():boolean {
  return (!this.pointVente.nom||!this.pointVente.adresse||!this.pointVente.telephone);
}

dismiss(data?:any) {
      this.viewCtrl.dismiss(data);
  } 


onSubmit(){
       let self=this;
      let loader= this.notify.loading({
      content: "Enregistrement...",
    }); 
  this.manager.save('pointvente',this.pointVente).then((data)=>{
    loader.dismiss().then(()=>{
      self.dismiss(data);
       this.notify.onSuccess({message:"Enregistremebt effectue"})
     });  
    
  },error=>{
    loader.dismiss()
    this.notify.onError({message:"Un probleme est survenu"})
  })
    loader.present();

}

deleteItem(){
  let self=this;
  this.notify.showAlert({
    title:"Suppression",
    message:"Voulez-vous supprimer cet element ?",
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
          this.manager.delete('pointvente',this.pointVente).then(data=>{
            if(data.ok){
              loader.dismiss().then(()=>{
                self.dismiss(data);
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
}
