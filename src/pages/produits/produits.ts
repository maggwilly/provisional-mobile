import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';


@IonicPage()
@Component({
  selector: 'page-produits',
  templateUrl: 'produits.html',
})
export class ProduitsPage {
  produits: any[] = []
  queryText = '';
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public notify: AppNotify,
    public storage: Storage) {
  
  }

  ionViewDidLoad() {
    this.loadData()
  }

  loadData(){    
    this.storage.get('_produits').then((data) => {
      this.produits = data;
    this.manager.get('produit').then(data=>{
      this.produits=data?data:[]
      this.storage.set('_produits',this.produits)    
    },error=>{
      this.notify.onError({message:"PROBLEME ! Verifiez votre connexion internet"})
    })
  });
  }

  loadRemoteData(){
    let loader = this.loadingCtrl.create({
      content: "chargement...",
    });    
    this.manager.get('produit').then(data=>{
      this.produits=data?data:[]
      this.storage.set('_produits',this.produits)    
    },error=>{
      this.notify.onError({message:"PROBLEME ! Verifiez votre connexion internet"})
    })
    loader.present();
  }
 
  add(){
    this.navCtrl.push('ProduitPage')
  }
  search() {
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    this.produits.forEach(item => {
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
