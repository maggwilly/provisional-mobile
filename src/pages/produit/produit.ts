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
  inset:boolean;
  constructor(
       public navCtrl: NavController,
       public storage: Storage,
       public navParams: NavParams, 
       public viewCtrl: ViewController,
       public notify: AppNotify,
       public manager: ManagerProvider,) {
       this.produit=this.navParams.get('produit');
       if(!this.inset)
       this.inset=this.navParams.get('inset');
  }
  ionViewDidLoad() { 
        console.log(  this.produit);
        
  }


isInvalid():boolean {
  return (!this.produit.nom||!this.produit.cout);
}

dismiss(data?:any) {
      this.viewCtrl.dismiss(data);
  } 


onSubmit(){
     let self=this;
      let loader= this.notify.loading({
      content: "Enregistrement...",
    }); 
  this.manager.save('produit',this.produit).then((data)=>{
     loader.dismiss().then(()=>{
      if(!data.error){
        self.dismiss(data);
        return  this.notify .onSuccess({message:"Enregistrement effectué"})
      }
      this.notify.onError({message:"Une erreur s'est produite et l'opération n'a pas put se terminer correctement"})

     });    
  
  },error=>{
    loader.dismiss()
    this.notify.onSuccess({message:"Verifiez votre connexion internet"})
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
            this.manager.delete('produit',this.produit).then(data=>{
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
