import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ViewController  ,ModalController, Events} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
import { LocalisationProvider } from '../../providers/localisation/localisation';

@IonicPage()
@Component({
  selector: 'page-selectproduit',
  templateUrl: 'selectproduit.html',
})
export class SelectproduitPage {

  produits: any[] = []
  queryText = '';
  loading:boolean=false;
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public localisation:LocalisationProvider,
    public events:Events,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public notify: AppNotify,
    public storage: Storage) {
      this.events.subscribe('loaded:produit:new',()=>{
        //this.loadData();
       })
  }

  ionViewDidLoad() {
      this.loadData()
  }

  loadData(){ 
    this.loading=true;   
    this.manager.get('produit',this.localisation.isOnline()).then(data=>{
      this.produits=data?data:[]
      this.loading=false; 
      this.localisation.onConnect(this.localisation.isOnline());
    },error=>{
      this.localisation.onConnect(false);
      this.loading=false; 
      this.notify.onError({message:" Verifiez votre connexion internet"})
    })

  }

  dismiss(data?:any) {
    this.viewCtrl.dismiss(data);
}

  loadRemoteData(){
    let loader= this.notify.loading({
      content: "chargement...",
    });    
    this.manager.get('produit',this.localisation.isOnline()).then(data=>{
      this.produits=data?data:[]
      loader.dismiss();     
    },error=>{
      loader.dismiss();   
      this.notify.onError({message:"Verifiez votre connexion internet"})
    })
    loader.present();
  }
 
  select(produit:any){
    this.viewCtrl.dismiss(produit);
  }

  add(produit={}){
    let modal=  this.modalCtrl.create('ProduitPage',{produit:produit,inset:true}, { cssClass: 'inset-modal' })
   modal.onDidDismiss(data=>{
    let index=-1;
    if(!data)
     return
   if(data.deletedId||data.id){
       index= this.produits.findIndex(item=>item.id==data.deletedId||item.id==data.id);
        if(index>-1)
       this.produits.splice(index,1);
       this.produits.splice(0,0,data); 
       this.select(data) 
     }
   }) 
   modal.present()
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

