import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { Storage } from '@ionic/storage';
import { AppNotify } from '../../app/app-notify';


@IonicPage()
@Component({
  selector: 'page-point-vente-detail',
  templateUrl: 'point-vente-detail.html',
})
export class PointVenteDetailPage {
  rendezvous: any={};
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public notify: AppNotify,
    public storage: Storage
  ) {
    this.rendezvous = navParams.get('rendezvous');
    console.log(this.rendezvous);
    
  }

  ionViewDidLoad() {

  }

 cancelRdv(){

  let loader= this.notify.loading({
    content: "Annulation...",
        }); 
   this.manager.delete('rendezvous',this.rendezvous.rendezvous).then((data)=>{
    if(data.ok){
      loader.dismiss().then(()=>{
        this.rendezvous.dateat=null;
         this.notify.onSuccess({message:"Annulé"})
       });
      }
 },error=>{
  loader.dismiss()
this.notify.onError({message:"Un probleme est survenu"})
});

   } 
   editRdv(){
    let modal=  this.modalCtrl.create('RendezvousPage',{rendezvous: this.rendezvous}, { cssClass: 'inset-modal' })
    modal.onDidDismiss(rdv=>{
      if(!rdv)
       return
       this.rendezvous=rdv;
     }) 
     modal.present() 
   }
   
createRdv(){
  
  let modal=  this.modalCtrl.create('RendezvousPage',{rendezvous:this.rendezvous}, { cssClass: 'inset-modal' })
  modal.onDidDismiss(rdv=>{
    if(!rdv)
     return
     this.rendezvous=rdv;
   }) 
   modal.present()
}

}

