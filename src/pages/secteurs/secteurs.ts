import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ViewController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify'
import { LocalisationProvider } from '../../providers/localisation/localisation';
/**
 * Generated class for the SecteursPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-secteurs',
  templateUrl: 'secteurs.html',
})
export class SecteursPage {
  secteurs: any[] = []
  queryText = '';
  openAddPage: any;
  loading
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public manager: ManagerProvider,
    public modalCtrl: ModalController,
    public localisation:LocalisationProvider,
    public notify: AppNotify,
    public events: Events,
    public viewCtrl: ViewController,
    public storage: Storage,
    public navParams: NavParams
  ) {
    this.openAddPage = this.navParams.get('openAddPage')
    this.events.subscribe('loaded:secteur:new', () => {
     // this.loadData();
    })
  }

  ionViewDidLoad() {
    if (this.openAddPage)
      this.add()
    this.loadData()
  }

  dismiss(data?: any) {
    this.viewCtrl.dismiss(data);
  }

  loadData() {
    this.loading=true ;
    this.manager.get('secteur',this.localisation.isOnline()).then(data => {
      this.secteurs = data ? data : []
      this.loading=false ;
      this.localisation.onConnect(this.localisation.isOnline());
    },error=>{
      this.localisation.onConnect(false);
      console.log(error);
      this.loading=false ;
      this.notify.onError({ message: " Verifiez votre connexion internet" })
    })

  }

  loadRemoteData() {
    let loader = this.notify.loading({
      content: "chargement...",
    });
    this.loading=true ;
    this.manager.get('secteur', true).then(data => {
      this.secteurs = data ? data : []
      this.loading=false ;
      loader.dismiss();
      this.localisation.onConnect(this.localisation.isOnline());
    },error=>{
      this.localisation.onConnect(false);
      loader.dismiss();
      this.notify.onError({ message: "Verifiez votre connexion internet" })
    })
    loader.present();
  }


  add(secteur = {}) {
    let modal = this.modalCtrl.create('SecteurPage', { secteur: secteur, inset: true }, { cssClass: 'inset-modal' })
    modal.onDidDismiss(data => {
      let index = -1;
      if(data&&(data.deletedId||data.id)){
        index= this.secteurs.findIndex(item=>item.id==data.deletedId||item.id==data.id);
         if(index>-1)
        this.secteurs.splice(index,1);
        if(data.id)
         this.secteurs.splice(0,0,data); 
      }
    })
    modal.present()
  }


  search() {
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    this.secteurs.forEach(item => {
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
