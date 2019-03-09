import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify'
/**
 * Generated class for the RapportsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rapports',
  templateUrl: 'rapports.html',
})
export class RapportsPage {
  rapports: any[] = []
  queryText = '';
  constructor(public navCtrl: NavController ,
        public loadingCtrl: LoadingController,
    public manager: ManagerProvider,
    public notify: AppNotify,
    public storage: Storage,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.loadData()
  }

  loadData(){    
    this.storage.get('_rapports').then((data) => {
      this.rapports = data?data:[];
    this.manager.get('rapport').then(data=>{
      this.rapports=data?data:[]
      this.storage.set('_rapports',this.rapports)    
    },error=>{
      this.notify.onError({message:" Verifiez votre connexion internet"})
    })
  });
  }

  loadRemoteData(){
    let loader = this.loadingCtrl.create({
      content: "chargement...",
    });    
    this.manager.get('rapport').then(data=>{
      this.rapports=data?data:[]
      this.storage.set('_rapports',this.rapports)   
      loader.dismiss();    
    },error=>{
      loader.dismiss();   
      this.notify.onError({message:"Verifiez votre connexion internet"})
    })
    loader.present();
  }
 
  add(){
    this.navCtrl.push('ProduitPage')
  }
  search() {
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    this.rapports.forEach(item => {
      item.hide = true;
      this.filter(item, queryWords);
    });

  }
  filter(item, queryWords) {
    let matchesQueryText = false;
    if (queryWords.length) {
      // of any query word is in the session name than it passes the query test
      queryWords.forEach(queryWord => {
        if (item.periode.toLowerCase().indexOf(queryWord) > -1) {
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
