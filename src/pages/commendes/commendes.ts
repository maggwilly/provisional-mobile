import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, LoadingController, ItemSliding, App, ModalController } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { Storage } from '@ionic/storage';
import { AppNotify } from '../../app/app-notify';
import { LocalisationProvider } from '../../providers/localisation/localisation';
import * as moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-commendes',
  templateUrl: 'commendes.html',
})
export class CommendesPage {
  commendes: any = []
  today: string;
  queryText = '';
  openAddPage:boolean
  filtre:any
  nbrecriteres:number;
  loading:boolean;
  isOnline:boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public manager: ManagerProvider,
    public app: App,
    public events: Events,
    public localisation:LocalisationProvider,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public notify: AppNotify,
    public storage: Storage
  ) {
    this.isOnline=this.localisation.isOnline();
    this.today = moment().format("YYYY-MM-DD");
    this.openAddPage=this.navParams.get('openAddPage')
    this.events.subscribe('commende.added', (data) => {
      if(data)
    this.commendes.push(data);
    })
    this.events.subscribe('commende.updated', (data) => {
      let index = this.commendes.findIndex(item => item.id == data.id);
      if (index > -1) {
        this.commendes.splice(index, 1);
        this.commendes.push(data);
      }
    })
    this.events.subscribe('loaded:commande:new',()=>{
      if(!this.nbrecriteres)
         this.loadData();
     })
  }

  ionViewDidLoad() {
    this.refresh()

  }

  loadData() {
    this.loading=true;
      this.manager.get('commende',this.localisation.isOnline()).then(data => {
        this.loading=false;
        this.commendes = data ? data : []
        this.search()
        this.localisation.onConnect(this.localisation.isOnline());
      },error=>{
        this.localisation.onConnect(false);
        this.notify.onSuccess({ message: "Verifiez votre connexion internet" })
      })
  }

  refresh(){
    if(!this.filtre)
    this.filtre={type:'',
    user:'',secteur:''
    ,ville:'',
    afterdate:moment().startOf('month').format("YYYY-MM-DD"),
    beforedate:moment().endOf('week').format("YYYY-MM-DD")
  };
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
    let loader = this.loadingCtrl.create({
      content: "chargement...",
    });
    this.loading=true;
    this.manager.get('commende',true,null,null,this.filtre,this.nbrecriteres).then(data => {
      this.commendes = data ? data : []
      this.loading=false;
      this.search()
      loader.dismiss();
      this.localisation.onConnect(this.localisation.isOnline());
    },error=>{
      this.localisation.onConnect(false);
      this.notify.onSuccess({ message: " Verifiez votre connexion internet" })
      loader.dismiss();
    });
    loader.present();
  }


  confirm(commende: any, slidingItem: ItemSliding) {
    slidingItem.close();
    if (!commende)
      return
    this.notify.showAlert({
      title: 'Supression de rapport',
      message: 'Voulez-vous supprimer cet element ?',
      buttons: [
        {
          text: 'Non',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Supprimer',
          handler: () => {
            slidingItem.close();
            let loader = this.notify.loading({ content: 'suppression ...' });
            this.manager.delete('commende', commende).then(data => {
              if (data.ok) {
                commende.deleted=true;
                loader.dismiss();
              } else if (data.error) {
                loader.dismiss()
                this.notify.onError({ message: "Cet element est lie a d'autres." })
              }
            }, error => {
              this.notify.onSuccess({ message: "Verifiez votre connexion internet" })
              loader.dismiss();
            });
            loader.present();
          }
        }
      ]
    });

  }



  openFilter() {
    let modal = this.modalCtrl.create('FiltreVentePage', { filtre: this.filtre })
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

  openCart(commende) {
    this.navCtrl.push('CommendesViewPage', { commende: commende })
  }

  getPointVente(commende: any) {
    return commende.pointVenteItem ? commende.pointVenteItem : commende.pointVente
  }

  add() {
    this.openAddPage=false;
    let commende: any = { lignes: [], date: new Date() };
    let modal = this.modalCtrl.create('SelectclientPage')
    modal.onDidDismiss(data => {
      if (!data)
        return // this.app.getRootNav().pop();
      commende.pointVente = data;
      this.navCtrl.push('CommendesViewPage', { commende: commende })
    })
    modal.present();
  }

  search() {
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    this.commendes.forEach(item => {
      item.hide = true;
      this.filter(item, queryWords);
    });

  }

  filter(item, queryWords) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.pointVente.nom.toLowerCase().indexOf(queryWord) > -1) {
          matchesQueryText = true;
        }
      });
    } else {
      matchesQueryText = true;
    }

    item.hide = !(matchesQueryText);
  }


openMap(){
  this.navCtrl.push('MapPage',{target: 'commendes',points:  this.commendes,title:`Livraisons effectuées`,filtre: this.filtre});
}
}
