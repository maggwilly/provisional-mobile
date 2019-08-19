import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';
import * as moment from 'moment';
import { LocalisationProvider } from '../../providers/localisation/localisation';

@IonicPage()
@Component({
  selector: 'page-previsions',
  templateUrl: 'previsions.html',
})
export class PrevisionsPage {
  filtre:any
  previsions:any[]=[]
  queryText = '';
  loading:boolean;
  isOnline:boolean
  constructor(
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public localisation:LocalisationProvider,
    public manager: ManagerProvider,
    public loadingCtrl: LoadingController,
    public notify: AppNotify,
     public navParams: NavParams) {
      this.isOnline=this.localisation.isOnline();
  }

  ionViewDidLoad() {
    this.refresh(); 
  }

  refresh(){
    this.filtre={type:''
    ,user:'',secteur:'',
    ville:'',
    afterdate:moment().startOf('month').format("YYYY-MM-DD"),
    beforedate:moment().endOf('month').format("YYYY-MM-DD")};
      if(this.localisation.isOnline())
        return this.loadRemoteData();
    return this.loadData()
  }

  loadData() {
    this.loading=true;
    this.manager.get('prevision').then(data => {
      this.previsions = data?data:[]
      this.loading=false;
      this.localisation.onConnect(this.localisation.isOnline());
    },error=>{
      this.localisation.onConnect(false);
      this.notify.onSuccess({message:"PROBLEME ! Verifiez votre connexion internet"})
    })
  };

  loadRemoteData() {
    let loader = this.loadingCtrl.create({
      content: "chargement...",
    });
    this.loading=true;
    this.manager.get('prevision',true,null,null,this.filtre,1).then(data => {
      this.previsions = data?data:[]
      console.log(this.previsions);
      this.loading=false;
      loader.dismiss(); 
      this.localisation.onConnect(this.localisation.isOnline());
    },error=>{
      this.localisation.onConnect(false);
      loader.dismiss();
      console.log(error);
      this.notify.onSuccess({message:"PROBLEME ! Verifiez votre connexion internet"})
    });
    loader.present();
  }

  openDetail(produit){
    this.navCtrl.push('PrevisionDetailsPage', { produit: produit })
  }
  openFilter() {
    let modal = this.modalCtrl.create('FiltreStatsPage', { filtre: this.filtre })
    modal.onDidDismiss(data => {
      if(!data)
      return;
    return this.loadRemoteData();
    });
    modal.present()
  }

  search() {
    let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
    let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
    this.previsions.forEach(item => {
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
