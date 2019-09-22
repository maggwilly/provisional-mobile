import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, App, Item, ItemSliding, ModalController } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
import { UserProvider } from '../../providers/user/user';
import * as moment from 'moment';
import { LocalisationProvider } from '../../providers/localisation/localisation';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-commendes-view',
  templateUrl: 'commendes-view.html',
})
export class CommendesViewPage {
  commende: any = { lignes: [] };
  activeItemSliding: ItemSliding = null;
  editing: boolean = false;
  edited: boolean = false;
  pointVente: any = {}
  submitted = true;
  constructor(
    public navCtrl: NavController,
    public manager: ManagerProvider,
    public userService: UserProvider,
    public modalCtrl: ModalController,
    public localisation:LocalisationProvider,
    public events: Events,
    public notify: AppNotify,
    public app: App,
    public navParams: NavParams,
    public storage: Storage
  ) {
   
    if(navParams.get('commende')){
      this.commende = navParams.get('commende');
      this.storage.set('displayed',this.commende)
    }else{
      this.storage.get('displayed').then((displayed)=>{
      this.commende =displayed;
      if (!this.commende.date)
      this.commende.date = moment().format("YYYY-MM-DD HH:mm");
      this.pointVente = this.commende.pointVente;
      })
      return;
    }
    if (!this.commende.date)
      this.commende.date = moment().format("YYYY-MM-DD HH:mm");
    this.pointVente = this.commende.pointVente;
  }

  ionViewDidEnter() {
    if (!this.commende.id) {
      this.edited = true;
      return
    }
    this.manager.show('commende', this.commende.id,this.localisation.isOnline()).then((data) => {
      this.commende = data;
      this.edited = false;
      this.submitted = false;
    }, error => {
      console.log(error);
      
      this.notify.onError({ message: "Verifiez votre connexion internet" })
    })
  }


  canEdit(): boolean {
    return this.commende.terminated && this.userService.amIMyParent() || !this.commende.terminated
  }

  deleteItem(list, index) {
    if (!this.canEdit())
      return
    list.splice(index, 1);
    this.edited = true;
    this.editing = false;
  }

  delete() {
    if (!this.canEdit())
      return
    this.notify.showAlert({
      title: "Suppression",
      message: "Voulez-vous supprimer cet element ?",
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
            let loader = this.notify.loading({
              content: "Suppression...",
            });
            this.manager.delete('commende', this.commende).then(data => {
              if (data.ok) {
                loader.dismiss().then(() => {
                  this.commende.deleted = true;
                  this.pointVente.lastCommende=null;
                  this.manager.storeEntityLocally('pointvente', null)
                  this.events.publish('commende.added', null);
                  this.app.getActiveNav().pop();
                  this.notify.onSuccess({ message: "Element supprime" })
                });
              } else {
                loader.dismiss()
                this.notify.onError({ message: "Cet element est lié a d'autres. Vous ne pouvez pas le supprimer" })
              }
            }, error => {
              loader.dismiss()
              this.notify.onError({ message: "Un probleme est survenu" })
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


  terminate() {
    this.commende.terminated = true;
    this.commende.change = true;
    let loader = this.notify.loading({ content: 'Enregistrement ...' });
    this.manager.save('commende', this.commende).then((data) => {
      loader.dismiss().then(() => {
        if (!data.error) {
          this.edited = false;
          this.commende = data;
          this.events.publish('commende.update', data);
          return this.notify.onSuccess({ message: "Enregistrement effectué" })
        }
        this.commende.terminated = false;
        this.notify.onError({ message: "Une erreur s'est produite" })
      });
    }, error => {
      this.commende.terminated = false;
      loader.dismiss();
      this.notify.onError({ message: "Verifiez votre connexion internet" })
    })
    loader.present();
  }

  save() {
    this.commende.change = true;
    let loader = this.notify.loading({ content: 'Enregistrement ...' });
    this.manager.save('commende', this.commende).then((data) => {
      loader.dismiss().then(() => {
        if (!data.error) {
          this.edited = false;
          this.pointVente.lastCommende = {
            id: this.commende.id,
            date: this.commende.date
          }
         // this.manager.storeEntityLocally('pointvente', this.pointVente)
          this.events.publish('commende.added', data);
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
        this.edited = true;
        let index = this.commende.lignes.findIndex(item => item.produit == data.produit)
        if (index > 0)
          this.commende.lignes.splice(index, 1);
        this.commende.lignes.push(data);
        this.commende.total += Number(data.total)
      })
      modal.present();
    })
    modal.present();
  }


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
