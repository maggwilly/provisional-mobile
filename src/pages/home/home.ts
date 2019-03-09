import { Component } from '@angular/core';
import {PopoverController,IonicPage, Events, NavController, ModalController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ManagerProvider } from '../../providers/manager/manager';
import { AppNotify } from '../../app/app-notify';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pointVentes: any = [];
  queryText = '';
  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public events: Events,
    public manager: ManagerProvider,
    private popoverCtrl: PopoverController,
    public notify: AppNotify,
    public loadingCtrl: LoadingController,
    public storage: Storage) { 
     
    }

  ionViewDidLoad() {
    this.loadData();

  }

  loadData(){
    this.storage.get('_pointVentes').then((data) => {
      this.pointVentes = data?data:[];
      this.manager.get('pointvente').then(data=>{
        this.pointVentes=data?data:[]
        this.storage.set('_pointVentes',this.pointVentes)    
      },error=>{
        console.log(error)
        this.notify.onSuccess({message:"Probleme de connexion"})
      })
    });  
  }

  add(){
    this.navCtrl.push('PointVentePage')
  }



  loadRemoteData(){
    let loader = this.loadingCtrl.create({
      content: "chargement...",
    });    
    this.manager.get('pointvente').then(data=>{
      this.pointVentes=data?data:[]
      this.storage.set('_pointVentes',this.pointVentes)
      loader.dismiss();      
    },error=>{
      loader.dismiss(); 
      console.log(error)
      this.notify.onSuccess({message:"Probleme de connexion"})
    })
    loader.present();
  }


  showCommende(pointVente:any){
   this.navCtrl.push('PointVenteDetailPage',{pointVente:pointVente})

  }

  
  search() {
    this.storage.get('_pointVentes').then((data) => {
      this.pointVentes = data;
      let queryText = this.queryText.toLowerCase().replace(/,|\.|-/g, ' ');
      let queryWords = queryText.split(' ').filter(w => !!w.trim().length);
      this.pointVentes.forEach(item => {
        item.hide = true;
        this.filter(item, queryWords);
      });
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
      matchesQueryText = true;
    }
    item.hide = !(matchesQueryText);
  }

    presentPopover(ev?:any) {

    let popover = this.popoverCtrl.create('PopOverMenuPage');
    popover.present({
      ev: ev
    });
  }
}
