import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ItemSliding, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
import * as moment from 'moment';
import { LocalisationProvider } from '../../providers/localisation/localisation';

@IonicPage()
@Component({
  selector: 'page-pointventes',
  templateUrl: 'pointventes.html',
})
export class PointventesPage {
  pointventes: any[] = []
  openAddPage: boolean;
  filtre:any
  queryText = '';
  nbrecriteres:number;
  loading:boolean=true;
  isOnline:boolean;
  constructor(
    public navCtrl: NavController,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public localisation:LocalisationProvider,
    public modalCtrl: ModalController,
    public events: Events,
    public notify: AppNotify,
    public storage: Storage,
    public navParams: NavParams) {
      this.isOnline=this.localisation.isOnline();
    this.openAddPage = this.navParams.get('openAddPage')
    this.filtre = this.navParams.get('filtre');
    this.events.subscribe('loaded:pointvente:new', () => {
     /* if(!this.nbrecriteres)
      this.loadData();*/
  
    })
  }

  ionViewDidLoad() {
    this.refresh();
  }


  loadData() {
    this.loading=true;
    this.manager.get('pointvente',this.localisation.isOnline()).then(data => {
      this.pointventes = data ? data : []
      this.loading=false;
      this.search()
      this.localisation.onConnect(this.localisation.isOnline());
    },error=>{
      this.localisation.onConnect(false);
      this.notify.onError({ message: "Verifiez votre connexion internet" })
    })
  }

  refresh(){
    if(!this.filtre)
    this.filtre={type:'',user:'',
    secteur:'',ville:'',
    afterdate:moment().startOf('year').format("YYYY-MM-DD"),
    beforedate:moment().endOf('week').format("YYYY-MM-DD")
  };
    this.nbrecriteres=0;
    this.queryText='';
    if (this.openAddPage){
         this.add()
        return this.loadData()
  }
    if(this.localisation.isOnline())
       return this.loadRemoteData();
       return this.loadData()
  }

  loadRemoteData() {
    this.countCricteres(this.filtre);
    /*let loader = this.notify.loading({
      content: "chargement...",
    });*/
    this.loading=true;
    this.manager.get('pointvente',true,null,null,this.filtre,this.nbrecriteres).then(data => {
      this.pointventes = data ? data : []
      this.loading=false;
      this.search()
     // loader.dismiss();
      this.localisation.onConnect(this.localisation.isOnline());
    },error=>{
      this.localisation.onConnect(false);
     // loader.dismiss();
      this.notify.onError({ message: "Verifiez votre connexion internet" })
    })
   // loader.present();
  }


  show(pointVente, slidingItem: ItemSliding) {
    slidingItem.close();
    this.navCtrl.push('PointVenteDetailPage', { pointVente: pointVente })
  }



  delete(pointVente, slidingItem: ItemSliding) {
    slidingItem.close();
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
            this.manager.delete('pointvente', pointVente).then(data => {
              if (data.ok) {
                loader.dismiss().then(() => {
                  this.findRemove(data);
                  this.notify.onSuccess({ message: "Element supprime" })
                });
              } else {
                loader.dismiss()
                this.notify.onError({ message: "Cet element est lie a d'autres. Vous ne pouvez pas le supprimer" })
              }
            }, error => {
              loader.dismiss()
              this.notify.onError({ message: "Un probleme est survenu" })
            })
            loader.present();
          }
        }
      ]
    })

  }
  add(pointVente = {}, slidingItem?: ItemSliding) {
    this.openAddPage=false;
    if (slidingItem)
      slidingItem.close();
    let modal = this.modalCtrl.create('PointVentePage', { pointVente: pointVente })
    modal.onDidDismiss(data => {
      let index = -1;
      if (!data)
        return
      if (data && (data.deletedId || data.id)) {
        index = this.pointventes.findIndex(item => item.id == data.deletedId || item.id == data.id);
        if (index > -1)
          this.pointventes.splice(index, 1);
          if(data.id)
          this.pointventes.splice(0,0,data); 
      }
    })
    modal.present()
  }

  openFilter() {
    let modal = this.modalCtrl.create('FiltrePointventePage', { filtre: this.filtre })
    modal.onDidDismiss(data => {
      if(!data)
      return;
    return this.loadRemoteData();
    });
    modal.present()
  }

  countCricteres(data:any){
    let nbrecriteres=0;
    Object.keys(data).forEach(key => {
      if(data[key])
        nbrecriteres++;
    });
    this.nbrecriteres=nbrecriteres;
  }

  findRemove(data: any) {
    let index = this.pointventes.findIndex(item => item.id == data.deletedId);
    if (index > -1)
      this.pointventes.splice(index, 1);
  }

  search() {
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    this.pointventes.forEach(item => {
      item.hide = true;
      this.filter(item, queryWords);
    });

  }
  filter(item, queryWords) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.nom.toLowerCase().indexOf(queryWord) > -1
          || item.adresse.toLowerCase().indexOf(queryWord) > -1
          || item.telephone.toLowerCase().indexOf(queryWord) > -1
          || item.quartier.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      // if there are no query words then this session passes the query test
      matchesQueryText = true;
    }
    item.hide = !(matchesQueryText);
  }

  openMap() {
    this.navCtrl.push('MapPage', { target: 'pointvente',points: this.pointventes, title: `Points de vente créés`,filtre: this.filtre });
  }

  doScroll(env){

  }
}
