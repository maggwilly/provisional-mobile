import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController,ModalController, ViewController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify'
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
  secteurs:any[]=[]
 queryText = '';
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public manager: ManagerProvider,
    public modalCtrl: ModalController,
    public notify: AppNotify,
    public events:Events,
    public viewCtrl: ViewController,
    public storage: Storage,
    public navParams: NavParams
     ) {
       this.events.subscribe('loaded:secteur:new',()=>{
        this.loadData();
       })
  }

  ionViewDidLoad() {
    this.loadData(true)
  }

  dismiss(data?:any) {
    this.viewCtrl.dismiss(data);
} 

  loadData(onlineIfEmpty?:boolean){    
    this.manager.get('secteur').then(data=>{
      this.secteurs=data?data:[] 
      if(onlineIfEmpty&&(!data||data.length))
      return this.loadRemoteData(); 
    },error=>{
      console.log(error);
      this.notify.onError({message:" Verifiez votre connexion internet"})
    })

  }

  loadRemoteData(){
    let loader= this.notify.loading({
      content: "chargement...",
    });    
    this.manager.get('secteur',true).then(data=>{
      this.secteurs=data?data:[]
      loader.dismiss();      
    },error=>{
      loader.dismiss();   
      this.notify.onError({message:"Verifiez votre connexion internet"})
    })
    loader.present();
  }
 

  add(secteur={}){
     let modal=  this.modalCtrl.create('SecteurPage',{secteur:secteur,inset:true}, { cssClass: 'inset-modal' })
    modal.onDidDismiss(data=>{
       let index=-1;
     if (data&&data.id) {
         index= this.secteurs.findIndex(item=>item.id==data.id);
         this.secteurs.splice(0,0,data); 
     }else if(data&&data.deletedId){
       index= this.secteurs.findIndex(item=>item.id==data.deletedId);
       if(index>-1)
      this.secteurs.splice(index,1);
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
