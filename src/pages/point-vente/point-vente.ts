import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ManagerProvider} from '../../providers/manager/manager';
import { IonicPage, NavParams, NavController, ViewController ,ModalController } from 'ionic-angular';
import { AppNotify } from '../../app/app-notify';
import { UserProvider } from '../../providers/user/user';
import { LocalisationProvider } from '../../providers/localisation/localisation';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-point-vente',
  templateUrl: 'point-vente.html',
})
export class PointVentePage {
  pointVente:any={};
  secteurs:any[]=[];
  inset:boolean;
  openAddPage:boolean
  fetching:boolean;
  constructor(
    public navCtrl: NavController,
    public storage: Storage, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public notify: AppNotify,
    public modalCtrl:ModalController,
    public localisation:LocalisationProvider,
    public userService:UserProvider,
    public manager: ManagerProvider,
    public location:LocalisationProvider
 
    ) {
      this.pointVente=this.navParams.get('pointVente')?this.navParams.get('pointVente'):{}
      this.inset=this.navParams.get('inset');
      if(!this.pointVente.secteur)
          this.pointVente.secteur=this.userService.user.secteur;
      if(this.pointVente.secteur)
        this.pointVente.secteur=this.pointVente.secteur.id;
        if(!this.pointVente.date)
          this.pointVente.date= moment().format("YYYY-MM-DD");
       //
    }

  getCurrentPosition($ev){
    if(!this.pointVente.atnow)
       return;
    this.fetching=true;
    this.location.getCurrentPosition().then((resp) => {
      this.pointVente.lat = resp.coords.latitude;
      this.pointVente.long = resp.coords.longitude;
      this.pointVente.accuracy= resp.coords.accuracy;
      this.fetching=false;
    }).catch((error) => {
      this.notify.onError(error);
      this.fetching=false;
      console.log(error);
    });
  }

  ionViewDidLoad() { 
    this.manager.get('secteur').then(data=>{
      this.secteurs=data?data:[]
      if(this.pointVente.secteur&&this.pointVente.secteur.id)
      this.pointVente.secteur=this.pointVente.secteur.id;        
    },error=>{
      this.notify.onError({message:" Verifiez votre connexion internet"})
    })  
  }

  select(){
    let modal=this.modalCtrl.create('QuartiersPage',{ville:this.pointVente.ville});
    modal.onDidDismiss(data => {
          this.pointVente.quartier=data;
     });
     modal.present();
  }

isInvalid():boolean {
  return (!this.pointVente.nom||!this.pointVente.adresse||!this.pointVente.telephone||(this.pointVente.atnow&&(!this.pointVente.lat||!this.pointVente.long)));
}

dismiss(data?:any) {
      this.viewCtrl.dismiss(data);
  } 


onSubmit(){
      this.pointVente.change=true;
       let self=this;
      let loader= this.notify.loading({
      content: "Enregistrement...",
    }); 
  this.manager.save('pointvente',this.pointVente,this.localisation.isOnline()).then((data)=>{
    loader.dismiss().then(()=>{
      if(!data.error){
        self.dismiss(data);
        return  this.notify .onSuccess({message:"Enregistrement effectué"})
      }
      this.notify.onError({message:"Une erreur s'est produite"})

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
