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
  target: string = 'today'
  queryText = '';
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
      this.loadData();
     })
  }

  ionViewDidLoad() {
    this.loadData(true);
  }

  loadData(onlineIfEmpty?:boolean) {
      this.manager.get('commende').then(data => {
        this.commendes = data ? data : []
        if(onlineIfEmpty&&(!data||data.length))
            return this.loadRemoteData();
        this.search()
      }, error => {
        this.notify.onSuccess({ message: "Verifiez votre connexion internet" })
      })
  }


  loadRemoteData() {
    let loader = this.loadingCtrl.create({});
    this.manager.get('commende',true).then(data => {
      this.commendes = data ? data : []
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



  openCart(commende) {
    this.app.getActiveNav().push('CommendesViewPage', { commende: commende })
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
      this.app.getRootNav().push('CommendesViewPage', { commende: commende })
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
    let matchesSegment = false;
    if (this.target === 'today') {
      if (item.date == this.today)
        matchesSegment = true;
    } else if (this.target === 'notended') {
      if (!item.terminated)
        matchesSegment = true;
    } else matchesSegment = true;

    item.hide = !(matchesQueryText && matchesSegment);
  }

}
