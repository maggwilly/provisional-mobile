import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, LoadingController, ItemSliding, App, ModalController } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { Storage } from '@ionic/storage';
import { AppNotify } from '../../app/app-notify';
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
  filtre:any={type:'',user:'',secteur:'',ville:'',beforedate:moment().format("YYYY-MM-DD")}
  nbrecriteres:number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public manager: ManagerProvider,
    public app: App,
    public events: Events,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public notify: AppNotify,
    public storage: Storage
  ) {
    this.today = moment().format("YYYY-MM-DD");
    this.openAddPage=this.navParams.get('openAddPage')
    this.events.subscribe('commende.added', (data) => {
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
    if (this.openAddPage)
    this.add()
    this.loadData(true);
  }

  loadData(onlineIfEmpty?:boolean) {
      this.manager.get('commende').then(data => {
        console.log(data);
        
        this.commendes = data ? data : []
        if(onlineIfEmpty&&(!data||data.length))
            return this.loadRemoteData();
        this.search()
      }, error => {
        this.notify.onSuccess({ message: "Verifiez votre connexion internet" })
      })
  }

  refresh(){
    this.filtre={type:'',user:'',secteur:'',ville:'',beforedate:moment().format("YYYY-MM-DD")};
    this.nbrecriteres=0;
    this.queryText='';
    return this.loadRemoteData();
  }

  loadRemoteData() {
    let loader = this.loadingCtrl.create({
      content: "chargement...",
    });
    this.manager.get('commende',true,null,null,this.filtre,this.nbrecriteres).then(data => {
      this.commendes = data ? data : []
      console.log(data);
      
      this.search()
      loader.dismiss();
    }, error => {
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
      let nbrecriteres=0;
      if(!data)
      return;
    Object.keys(data).forEach(key => {
      if(data[key])
        nbrecriteres++;
    });
    this.nbrecriteres=nbrecriteres;

    return this.loadRemoteData();
    });
    modal.present()
  }


  openCart(commende) {
    this.navCtrl.push('CommendesViewPage', { commende: commende })
  }

  getPointVente(commende: any) {
    return commende.pointVenteItem ? commende.pointVenteItem : commende.pointVente
  }

  add() {
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
  let points:any[]=[];
  this.commendes.forEach(commende => {
    if (commende.pointVente.lat&&commende.pointVente.long) {
      points.push({pos:{lat:commende.pointVente.lat,long:commende.pointVente.long},
                    title:commende.pointVente.nom,
                    address:commende.pointVente.adresse,
                    type:commende.pointVente.type,
                    quartier:commende.pointVente.quartier,
                    visited:commende.pointVente.lastCommende,
                   })
             }
       });
  this.navCtrl.push('MapPage',{points: points,title:`Interactions`});
}
}
