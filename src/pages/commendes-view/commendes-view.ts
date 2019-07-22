import { Component } from '@angular/core';
import {Events, IonicPage, NavController, NavParams, App, Item, ItemSliding, ModalController } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
import { UserProvider } from '../../providers/user/user';
import * as moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-commendes-view',
  templateUrl: 'commendes-view.html',
})
export class CommendesViewPage {
  commende: any = { lignes: [] };
  activeItemSliding: ItemSliding = null;
  editing: boolean = false;
  edited:boolean = false;
  pointVente: any = {}
  submitted=true;
  constructor(
    public navCtrl: NavController,
    public manager: ManagerProvider,
    public userService:UserProvider,
    public modalCtrl: ModalController,
    public events:Events,
    public notify: AppNotify,
    public app: App,
    public navParams: NavParams
  ) {
      this.commende = this.navParams.get('commende');
      if(!this.commende.date)
      this.commende.date= moment().format("YYYY-MM-DD HH:mm");
      this.pointVente = this.commende.pointVente;
  }

  ionViewDidEnter() {
    if (!this.commende.id){
        this.edited=true;
        return
    }
    
    this.manager.show('commende', this.commende.id).then((data) => {
      this.commende = data;
      this.edited=false;
      this.submitted=false;
      //this.makeUp();
    }, error => {
      this.notify.onError({ message: "Verifiez votre connexion internet" })
    })
  }

  makeUp(ligne?: any) {
    this.commende.total = 0;
    if (!this.commende.lignes)
      return
    if (ligne)
      return this.commende.total += Number(ligne.total);
    this.commende.lignes.forEach(ligne => {
      ligne.total = ligne.produit.cout * ligne.quantite
      ligne.nom = ligne.produit.nom;
      ligne.produit = ligne.produit.id;
      this.commende.total += Number(ligne.total);
    });
  }

canEdit():boolean{
 return this.commende.terminated&&this.userService.amIMyParent()|| !this.commende.terminated
}

  deleteItem(list, index) {
    if (!this.canEdit())
      return
    list.splice(index, 1);
    this.edited=true;  
    this.editing=false;
  }

 delete(){
  if (!this.canEdit())
  return
  this.notify.showAlert({
    title:"Suppression",
    message:"Voulez-vous supprimer cet element ?",
    buttons:[
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
          this.manager.delete('commende',this.commende).then(data=>{
            if(data.ok){
              loader.dismiss().then(()=>{
                this.commende.deleted=true;
                this.app.getActiveNav().pop();
                 this.notify.onSuccess({message:"Element supprime"})
               });
            }else{
                loader.dismiss()
               this.notify.onError({message:"Cet element est lié a d'autres. Vous ne pouvez pas le supprimer"})
            }
          },error=>{
              loader.dismiss()
            this.notify.onError({message:"Un probleme est survenu"})
          })
            loader.present();
        }
      }       
    ]
  });
 }
  toggleEditing() {
    this.editing = !this.editing;
    this.closeOption();
  }


  terminate(){
    this.commende.terminated=true;
    this.commende.change=true;
    //this.commende.pointVente = this.pointVente.id;
    let loader = this.notify.loading({ content: 'Enregistrement ...' });
    this.manager.save('commende', this.commende).then((data) => {
      loader.dismiss().then(() => {
        if (!data.error){
          this.edited=false;
          this.commende=data;
          this.events.publish('commende.update',data);
          return this.notify.onSuccess({ message: "Enregistrement effectué" })
        }
        this.commende.terminated=false;
        this.notify.onError({ message: "Une erreur s'est produite" })
      });
    }, error => {
      this.commende.terminated=false;
      loader.dismiss();
      this.notify.onError({ message: "Verifiez votre connexion internet" })
    })
    loader.present();  
  }

  save() {
    this.commende.change=true;
    //this.commende.pointVente = this.pointVente.id;
    let loader = this.notify.loading({ content: 'Enregistrement ...' });
    this.manager.save('commende', this.commende).then((data) => {
      loader.dismiss().then(() => {
        // this.app.getRootNav().pop();
        if (!data.error){
          this.edited=false;
          if(!this.commende.id){
            this.commende=data;
            this.events.publish('commende.added',data);
          }
          return this.notify.onSuccess({ message: "Enregistrement effectué" })
        }
        this.notify.onError({ message: "Une erreur s'est produite " })
      });
    }, error => {
      loader.dismiss();
      this.notify.onError({ message: "Verifiez votre connexion internet" })
    })
    loader.present();
  }

  addItem() {
    let modal = this.modalCtrl.create('SelectproduitPage')
    modal.onDidDismiss(data => {
      if (!data)
        return
      let modal = this.modalCtrl.create('CreatelignePage', { produit: data }, { cssClass: 'inset-modal' })
      modal.onDidDismiss(data => {
        if (!data)
          return
        this.edited=true;  
       let index= this.commende.lignes.findIndex(item=> item.produit==data.produit)
       if(index>0)
          this.commende.lignes.splice(index,1);
           this.commende.lignes.push(data);
           this.commende.total += Number(data.total)
      })
      modal.present();
    })
    modal.present();
  }


  /*removdFromCart(ligne: any, slidingItem: ItemSliding) {
    slidingItem.close();
    if (!this.canEdit())
      return
    let index = this.commende.lignes.findIndex(item => item.produit == ligne.produit);
    if (index > -1) {
      this.commende.lignes.splice(index, 1);
      this.commende.edit = true;
    }
  }*/




  openOption(itemSlide: ItemSliding, item: Item, event) {
    event.stopPropagation(); // here if you want item to be tappable
    if (this.activeItemSliding) { // use this so that only one active sliding item allowed
      this.closeOption();
    }
    this.activeItemSliding = itemSlide;
    const swipeAmount = 100; // set your required swipe amount
    itemSlide.startSliding(swipeAmount);
    itemSlide.moveSliding(swipeAmount);
    itemSlide.setElementClass('active-slide', true);
    itemSlide.setElementClass('active-options-right', true);
    item.setElementStyle('transition', null);
    item.setElementStyle('transform', 'translate3d(-' + swipeAmount + 'px, 0px, 0px)');
  }

  closeOption() {
    if (this.activeItemSliding) {
      this.activeItemSliding.close();
      this.activeItemSliding = null;
    }
  }
}
